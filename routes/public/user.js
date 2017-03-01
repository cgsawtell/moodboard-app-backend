const Router = require('koa-router')
const bcrypt = require('bcryptjs')
const monk = require('monk')
const db = require('../../db')
const validator = require('validator')
const router = new Router()
const users = db.get('users')

router.post('/user', async (ctx, next) => {
  const {firstName, lastName, userName, email, password} = ctx.request.body;
  if(userDataIsValid(firstName, lastName, userName, email, password)) {
    const hashedPassword = bcrypt.hashSync(password)
    const insertedUser = await users.insert({firstName, lastName, userName, email, 'password':hashedPassword})
    delete insertedUser.password 
    ctx.status = 201
    ctx.body = insertedUser
  }else{
    ctx.status = 400
    ctx.body = {message:'invalid user data'}
  }
})

const userDataIsValid = (firstName, lastName, userName, email, password) => {
  return (
    validator.isEmail(email) &&
    validator.isLength(password,{min:8,max:40}) &&
    validator.isLength(firstName,{min:2,max:40}) &&
    validator.isLength(lastName,{min:2,max:40}) &&
    validator.isLength(userName,{min:2,max:40})
  )
}

module.exports = router.middleware()