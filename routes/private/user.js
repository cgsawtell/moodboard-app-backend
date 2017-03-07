const Router = require('koa-router')
const bcrypt = require('bcryptjs')
const monk = require('monk')
const db = require('../../db')
const validator = require('validator')
const router = new Router()
const users = db.get('users')
const boards = db.get("boards")

router.get('/user/boards', async (ctx, next) => {
  const user =  ctx.state.user
  const myBoards = await boards.find({owner:user._id})
  const payload = {
    boards: [...myBoards]
  }
  ctx.body = payload
})

router.get('/user/:id', async (ctx, next)=>{
  const id = ctx.params.id
  if(id.length !== 24){
    ctx.throw(400,'invalid request')
    return
  }
  const userData = await users.findOne({_id:id})
  if(!userData){
    ctx.throw(404,"user not found")
  }
  delete userData.password 
  ctx.body = userData
})


router.put('/user', async (ctx, next) => {
  const id = ctx.state.user._id
  const {firstName, lastName, username, email, password} = ctx.request.fields;
  const userData = ctx.state.user
  const userDataToUpdate = Object.assign({}, userData, {firstName, lastName, username, email})

  if(password){
    const hashedPassword = bcrypt.hashSync(password)
    userDataToUpdate.password = hashedPassword;
  }
  
  const updatedUserData = await users.findOneAndUpdate({_id:id}, userDataToUpdate)
  delete updatedUserData.password 
  ctx.body = updatedUserData
})

const userDataIsValid = (firstName, lastName, username, email, password) => {
  return (
    validator.isEmail(email) &&
    validator.isLength(password,{min:8,max:40}) &&
    validator.isLength(firstName,{min:2,max:40}) &&
    validator.isLength(lastName,{min:2,max:40}) &&
    validator.isLength(username,{min:2,max:40})
  )
}

module.exports = router.middleware()