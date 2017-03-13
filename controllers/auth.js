const passport = require('koa-passport')

exports.login = (ctx, next) => {
  ctx.request.body = ctx.request.fields
  return passport.authenticate('local', {}, (err, user, info, status) => {
    if (user) {
      ctx.login(user)
      let returnData = user
      delete returnData.password
      ctx.body = returnData
    }
    else {
      ctx.status = 403
      ctx.body = { "message": "login failed" }
    }
  })(ctx, next)
}

exports.logout = (ctx, next) => {
  ctx.logout()
  ctx.body = { message: "success" }
}