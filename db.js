const monk = require('monk')
const db = monk('localhost:27017/Moody')

module.exports = db