const Router = require('koa-router')
const db = require('../../db')
const router = new Router()
const boards = db.get("boards")
const _ = require("lodash")

class Board{
  constructor(owner, name, description, entities=[], sharedWith=[]){
    this.owner = owner
    this.name = name
    this.description = description
    this.entities = entities
    this.sharedWith = sharedWith
  }
  setId(id){
    this._id = id
  }
  share(userId){
    if(_.includes(this.sharedWith, userId)) {
      //throw an error or some shit
    }
    else{
      this.sharedWith.push(userId)
    }
  }
  unshare(userIdToRemove){
    const sharedUserIndex = this.sharedWith.indexOf(userIdToRemove)
    if(sharedUserIndex>=0) {
      this.sharedWith.splice(sharedUserIndex,1)
    }
  }
  addEntity(){
    this.entities.push(newEntity)
  }
}
router.get('/board/:id', async (ctx, next) => {
  const _id = ctx.params.id
  const board =  await boards.findOne({_id})
  //TODO: probably should check to see if the requesting user has access
  if (board){
    ctx.body = board
  }
  else{
    ctx.status = 204
    ctx.body = {"message":`no board with id: ${_id} found`}
  }
})

router.put('/board/:id/addEntity', async (ctx, next) => {
  const { id } = ctx.params
  const { entity } = ctx.request.fields //should do some verification around what enity data I'm saving
  let board = await boards.findOne({ _id: id })
  board.entities.push(entity)
  const updatedBoard = await boards.findOneAndUpdate({ _id: id }, board)
  ctx.status = 200
  ctx.body = updatedBoard
})

router.put('/board/:boardId/updateEntity/:entityId', async (ctx,next) =>{
  const { boardId, entityId } = ctx.params
  const { entity } = ctx.request.fields //should do some verification around what enity data I'm saving
  let board = await boards.findOne({ _id: boardId })
  const entityIndex = board.entities.findIndex( entity => (entityId === entity.id) )

  if (entityIndex === -1){
    ctx.status = 204
    ctx.body = { "message": `no entity with id: ${entityId} found` }
  }
  board.entities[entityIndex] = entity
  const updatedBoard = await boards.findOneAndUpdate({ _id: boardId }, board)
  ctx.status = 200
  ctx.body = updatedBoard
})

router.post('/board', async (ctx, next) => {
  const user = ctx.state.user
  const {name, description} = ctx.request.fields
  const board = new Board(user._id, name, description)
  const newBoard = await boards.insert(board)
  ctx.body = newBoard
})

module.exports = router.middleware()