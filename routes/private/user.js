const Router = require('koa-router')
const user = require('../../controllers/user')
const router = new Router()

router.get('/user/:id', user.findFromId)
router.put('/user', user.update)
router.get('/user/boards', user.boards)

module.exports = router.middleware()