const Router = require('koa-router')
const router = new Router()

router.post('/upload-file', async (ctx, next) => {
  console.log(ctx.request.files);
  ctx.body = {'message': 'file recieved'}
})

module.exports = router.middleware();