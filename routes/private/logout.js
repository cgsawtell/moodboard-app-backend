const Router = require('koa-router')
const router = new Router()

router.post('/logout', (ctx, next) => {
  ctx.logout()
  ctx.body = {message:"success"}
})

module.exports = router.middleware()