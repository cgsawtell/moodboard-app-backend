const bcrypt = require('bcryptjs')
const monk = require('monk')
const validator = require('validator')
const db = require('../db')
const users = db.get('users')
const boards = db.get("boards")

exports.add = async (ctx, next) => {
  const { firstName, lastName, username, email, password } = ctx.request.fields;
  if (userDataIsValid(firstName, lastName, username, email, password)) {
    const hashedPassword = bcrypt.hashSync(password)
    const insertedUser = await users.insert({ firstName, lastName, username, email, 'password': hashedPassword })
    delete insertedUser.password
    ctx.status = 201
    ctx.body = insertedUser
  } else {
    ctx.status = 400
    ctx.body = { message: 'invalid user data' }
  }
}

exports.checkAvailability = async (ctx, next) => {
  const { username, email } = ctx.query;
  if (username && email) {
    ctx.status = 400
    return
  }
  if (username && typeof username === 'string') {
    const usernameAvailable = await isAvailable({ username })
    ctx.status = usernameAvailable ? 204 : 200
    return
  }
  if (email && typeof email === 'string') {
    const emailAvailable = await isAvailable({ email })
    ctx.status = emailAvailable ? 204 : 200
    return
  }
}

exports.update = async (ctx, next) => {
  const id = ctx.state.user._id
  const { firstName, lastName, username, email, password } = ctx.request.fields;
  const userData = ctx.state.user
  const userDataToUpdate = Object.assign({}, userData, { firstName, lastName, username, email })

  if (password) {
    const hashedPassword = bcrypt.hashSync(password)
    userDataToUpdate.password = hashedPassword;
  }

  const updatedUserData = await users.findOneAndUpdate({ _id: id }, userDataToUpdate)
  delete updatedUserData.password
  ctx.body = updatedUserData
}

exports.findFromId = async (ctx, next) => {
  const id = ctx.params.id
  if (id.length !== 24) {
    ctx.throw(400, 'invalid request')
    return
  }
  const userData = await users.findOne({ _id: id })
  if (!userData) {
    ctx.throw(404, "user not found")
  }
  delete userData.password
  ctx.body = userData
}

exports.boards = async (ctx, next) => {
  const user = ctx.state.user
  try {
    const myBoards = await boards.find({ owner: user._id })
    const payload = {
      boards: [...myBoards]
    }
    ctx.body = payload
  } catch (error) {
    console.error(error)
  }
}

const userDataIsValid = (firstName, lastName, username, email, password) => {
  return (
    validator.isEmail(email) &&
    validator.isLength(password, { min: 8, max: 40 }) &&
    validator.isLength(firstName, { min: 2, max: 40 }) &&
    validator.isLength(lastName, { min: 2, max: 40 }) &&
    validator.isLength(username, { min: 2, max: 40 })
  )
}

const isAvailable = async (needle) => {
  const user = await users.find(needle)
  return (user.length === 0)
}