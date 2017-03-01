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
  usernameField:"userName",
  passwordField:"password"
}

const handleLocalLogin = (username, password, done) => {
  findUser({userName:username})
  .then(user => {
    const validPassword = bcrypt.compareSync(password, user.password)
    if (username === user.userName && validPassword) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
  .catch(err => done(err))
}

passport.use(
  new LocalStrategy(LocalStrategySettings,handleLocalLogin)
)
