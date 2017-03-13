const Router = require('koa-router')
const auth = require('../../controllers/auth')
const router = new Router()

router.post('/logout', auth.logout)

module.exports = router.middleware()