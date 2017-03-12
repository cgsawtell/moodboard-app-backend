const Koa = require('koa')
const Router = require('koa-router')
const convert = require('koa-convert') // necessary until koa-better-body has been updated to support koa@2
const koaBetterBody = require('koa-better-body')
const serve = require('koa-static')
const config = require('./config')

const app = new Koa()
const port = 8000

// Sessions
const session = require('koa-session-minimal')
app.keys = ['secret']

require('./auth')
const passport = require('koa-passport')

const publicApi = new Router({
  prefix:'/api'
})
publicApi.use(require('./routes/public/login'))
publicApi.use(require('./routes/public/user'))

const checkAuthStatus = async (ctx, next) => {
  if(ctx.isAuthenticated()){
    await next();
  }
  else{
    ctx.status = 401
    ctx.body = {"message":"Private"}
  }
}

const privateApi = new Router({
  prefix:'/api'
})
  .use(checkAuthStatus)
  .use(require('./routes/private/user'))
  .use(require('./routes/private/logout'))
  .use(require('./routes/private/board'))
  .use(require('./routes/private/upload-file'))
  .use(require('./routes/private/file'))

module.exports = app
  .use(session({cookie:{httpOnly:false}}))
  .use(passport.initialize())
  .use(passport.session())
  .use(convert(
    koaBetterBody({
      uploadDir: config.uploadDirectory,
      keepExtensions: true
    })
  ))
  .use(publicApi.routes())
  .use(publicApi.allowedMethods())
  .use(privateApi.routes())
  .use(privateApi.allowedMethods())
  .use(serve(config.uploadDirectory))

app.listen(port)
console.log(`listening on port ${port}`);