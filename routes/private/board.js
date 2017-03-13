const Router = require('koa-router')
const board = require("../../controllers/board")
const router = new Router()

router.get('/board/:id', board.findFromId)
router.put('/board/:id/addEntity', board.addEntity)
router.put('/board/:boardId/updateEntity/:entityId', board.updateEntity)
router.post('/board', board.add)

module.exports = router.middleware()