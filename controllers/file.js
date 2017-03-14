const https = require('https');
const http = require('http');
const path = require('path')
const download = require('download')
const crypto = require('crypto')
const fs = require('fs')
const fileType = require('file-type')
const config = require('../config')

exports.upload = async (ctx, next) => {
  const uploadedFilePath = ctx.request.files[0].path
  const uploadedFileUrl = uploadedFilePath.split(path.sep).pop()
  ctx.body = { 'fileUrl': `/${uploadedFileUrl}` }
}

exports.download = async (ctx, next) => {
  const { url } = ctx.request.query
  const buf = crypto.randomBytes(16);
  let fileName = 'download_' + buf.toString('hex');
  const downloadedData = await download(url)
  const ext = `.${fileType(downloadedData).ext}`
  if (ext !== null) {
    fileName += ext
  }
  fs.writeFileSync(path.join(config.uploadDirectory, fileName), downloadedData);
  ctx.body = { 'fileUrl': `/${fileName}` }
}

exports.mimeType = async (ctx, next) => {
  const { url } = ctx.request.query
  try {
    const mimeType = await mimeTypeFromURL(url)
    ctx.body = { mimeType };
  } catch (error) {
    console.error(error)    
  }
}

const mimeTypeFromURL = (url) => {
  const urlProtocol = url.split(':')[0]
  const handlePromise = (resolve, reject) => {
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
        res.destroy();
        resolve(fileType(chunk).mime);
      });
    });
  }
  const promise = new Promise(handlePromise)
  return promise
}