const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const api = new Router({
  prefix:'/api'
})
const port = 3000

// Sessions
const convert = require('koa-convert') // necessary until koa-generic-session has been updated to support koa@2
const session = require('koa-generic-session')
app.keys = ['secret']

require('./auth')
const passport = require('koa-passport')

api.get('/', 
  (ctx, next) => {
    ctx.body = 'Sup'
  }
)

api.use(require('./routes/user'))

api.post('/login', (ctx, next) => {
  return passport.authenticate('local', {}, (err, user, info, status) => {
    if(user){
      // ctx.state.user = user
      ctx.login(user)
      ctx.body = {"message":"login success"}
    }
    else{
      ctx.status = 403
      ctx.body = {"message":"login failed"}
    }
  })(ctx,next)
})

module.exports = app
  .use(convert(session()))
  .use(passport.initialize())
  .use(passport.session())
  .use(bodyParser())
  .use(api.routes())
  .use(api.allowedMethods())

app.listen(port)
console.log(`listening on port ${port}`);