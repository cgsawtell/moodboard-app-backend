const Router = require('koa-router')
const bcrypt = require('bcryptjs')
const monk = require('monk')
const db = require('../db')
const validator = require('validator')
const router = new Router()
const users = db.get('users')

router.get('/user/:id', async (ctx, next)=>{
  const id = ctx.params.id
  if(id.length!==24){
    ctx.throw(400,'invalid request')
    return
  }
  const userData = await users.findOne({_id:id})
  if(!userData){
    ctx.throw(404,"user not found")
  }
  ctx.body = userData
})

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

router.put('/user', async (ctx, next) => {
  const id = ctx.state.user._id
  const {firstName, lastName, userName, email, password} = ctx.request.body;
  const userData = ctx.state.user
  const userDataToUpdate = Object.assign({}, userData, {firstName, lastName, userName, email})
  if(password){
    const hashedPassword = bcrypt.hashSync(password)
    userDataToUpdate.password = hashedPassword;
  }
  const updatedUserData = await users.findOneAndUpdate({_id:id}, userDataToUpdate)
  delete updatedUserData.password 
  ctx.body = updatedUserData
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