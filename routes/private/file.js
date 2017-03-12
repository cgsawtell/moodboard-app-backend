const Router = require('koa-router')
const fileType = require('file-type')
const https = require('https');
const http = require('http');
const path = require('path')
const fs = require('fs')
const download = require('download')
const crypto = require('crypto')
const config = require('../../config')
const router = new Router()

router.post('file/upload', async (ctx, next) => {
  const uploadedFilePath = ctx.request.files[0].path
  const uploadedFileUrl = uploadedFilePath.split(path.sep).pop()
  ctx.body = { 'fileUrl': `/${uploadedFileUrl}` }
})

router.get('file/mime-type', async (ctx, next) => {
  const {url} = ctx.request.query
  const mimeType = await mimeTypeFromURL(url)
  ctx.body = {mimeType};
})

router.post('file/download', async (ctx, next) => {
  const { url } = ctx.request.query
  const buf = crypto.randomBytes(16);
  let fileName = 'download_' + buf.toString('hex');
  const downloadData = await download(url)
  const ext = `.${fileType(downloadData).ext}`
  if(ext !== null){
    fileName += ext
  }
  fs.writeFileSync(path.join(config.uploadDirectory, fileName), downloadData);
  ctx.body = { 'fileUrl':`/${fileName}`}
})

const mimeTypeFromURL = (url) => {
  const urlProtocol = url.split(':')[0]
  const handlePromise = ( resolve, reject ) => {
    let protocol
    switch (urlProtocol) {
      case 'http':
        protocol = http
        break;
      case 'https':
        protocol = https
        break;
      default:
        throw new Error(`protocol: ${urlProtocol} not supported`)
        break;
    }
    protocol.get(url, res => {
      res.on('data', chunk => {
        resolve(fileType(chunk).mime);
        res.destroy();
      });
    });
  }
  const promise = new Promise(handlePromise)
  return promise
}

module.exports = router.middleware();
