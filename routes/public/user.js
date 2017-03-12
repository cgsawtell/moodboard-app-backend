const Router = require('koa-router')
const user = require('../../controllers/user')
const router = new Router()

router.post('/user', user.add)
router.get('/user/checkAvailability', user.checkAvailability)

module.exports = router.middleware()