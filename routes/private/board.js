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

router.post('/board', async (ctx, next) => {
  const user = ctx.state.user
  const {name, description} = ctx.request.fields
  const board = new Board(user._id, name, description)
  const newBoard = await boards.insert(board)
  ctx.body = newBoard
})

router.patch('/board/:id/addEntity',async (ctx,next) => {
  const {id} = ctx.params
  const boardData = await boards.findOne({_id:id})
})

module.exports = router.middleware()