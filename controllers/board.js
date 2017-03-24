const db = require('../db')
const boards = db.get("boards")

exports.add = async (ctx, next) => {
  const user = ctx.state.user
  const { name, description } = ctx.request.fields
  const board = {
    owner: user._id, 
    name, 
    description,
    entities: [],
    sharedWith: []
  }
  const newBoard = await boards.insert(board)
  ctx.body = newBoard
}

exports.findFromId = async (ctx, next) => {
  const _id = ctx.params.id
  const board = await boards.findOne({ _id })
  //TODO: probably should check to see if the requesting user has access
  if (board) {
    ctx.body = board
  }
  else {
    ctx.status = 204
    ctx.body = { "message": `no board with id: ${_id} found` }
  }
}

exports.addEntity = async (ctx, next) => {
  const { id: _id } = ctx.params
  const { entity } = ctx.request.fields //should do some verification around what enity data I'm saving
  let board = await boards.findOne({ _id })
  board.entities.push(entity)
  const updatedBoard = await boards.findOneAndUpdate({ _id }, board)
  ctx.status = 200
  ctx.body = updatedBoard
}

exports.updateEntity = async (ctx, next) => {
  const { boardId, entityId } = ctx.params
  const { entity } = ctx.request.fields //should do some verification around what enity data I'm saving
  let board = await boards.findOne({ _id: boardId })
  const entityIndex = board.entities.findIndex(entity => (entityId === entity.id))

  if (entityIndex === -1) {
    ctx.status = 204
    ctx.body = { "message": `no entity with id: ${entityId} found` }
  }
  board.entities[entityIndex] = entity
  const updatedBoard = await boards.findOneAndUpdate({ _id: boardId }, board)
  ctx.status = 200
  ctx.body = updatedBoard
}