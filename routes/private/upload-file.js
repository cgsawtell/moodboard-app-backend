const Router = require('koa-router')
const path = require('path')
const router = new Router()

router.post('/upload-file', async (ctx, next) => {
  const uploadedFilePath = ctx.request.files[0].path
  const uploadedFileUrl = uploadedFilePath.split(path.sep).pop()
  ctx.body = { 'fileUrl': `/${uploadedFileUrl}`}
})

module.exports = router.middleware();
