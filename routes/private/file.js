const Router = require('koa-router')
const file = require('../../controllers/file')
const router = new Router()

router.post('file/upload', file.upload)
router.post('file/download', file.download)
router.get('file/mime-type', file.mimeType)

module.exports = router.middleware();
