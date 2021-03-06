const passport = require("koa-passport"),
      LocalStrategy = require("passport-local").Strategy,
      bcrypt = require('bcryptjs'),
      db = require('./db'),
      users = db.get('users')

const findUser = async ( needle ) =>{
  return await users.findOne(needle)
}

passport.serializeUser(function(user, done) {
  done(null, user._id)
})

passport.deserializeUser(async function(id, done) {
  try {
    const user = await findUser({_id:id})
    done(null, user)
  } catch(err) {
    done(err)
  }
})

const LocalStrategySettings = {
  usernameField:"username",
  passwordField:"password"
}

const handleLocalLogin = async (username, password, done) => {
  try {
    const user = await findUser({username:username})
    const validPassword = bcrypt.compareSync(password, user.password)
    if (username === user.username && validPassword) {
      done(null, user)
    } else {
      done(null, false)
    }
  } catch (error) {
    done(error)
  }
}

passport.use(
  new LocalStrategy(LocalStrategySettings,handleLocalLogin)
)
