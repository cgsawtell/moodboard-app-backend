const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const port = 8000

// Sessions
const convert = require('koa-convert') // necessary until koa-generic-session has been updated to support koa@2
const session = require('koa-generic-session')
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

module.exports = app
  .use(convert(session()))
  .use(passport.initialize())
  .use(passport.session())
  .use(bodyParser())
  .use(publicApi.routes())
  .use(publicApi.allowedMethods())
  .use(privateApi.routes())
  .use(privateApi.allowedMethods())

app.listen(port)
console.log(`listening on port ${port}`);