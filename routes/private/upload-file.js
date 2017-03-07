const Router = require('koa-router')
const router = new Router()

router.post('/upload-file', async (ctx, next) => {
  const uploadedFilePath = ctx.request.files[0].path
  const uploadedFileUrl = uploadedFilePath.split('/').pop() //I wonder how this works on windows
  ctx.body = { 'fileUrl': `/${uploadedFileUrl}`}
})

module.exports = router.middleware();
