const Router = require('koa-router')
const passport = require('koa-passport')
const router = new Router()

router.post('/login', (ctx, next) => {
  return passport.authenticate('local', {}, (err, user, info, status) => {
    if(user){
      ctx.login(user)
      ctx.body = user
    }
    else{
      ctx.status = 403
      ctx.body = {"message":"login failed"}
    }
  })(ctx,next)
})

module.exports = router.middleware()