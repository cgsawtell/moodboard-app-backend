const supertest = require('supertest')
const app = require('../')
const request = supertest.agent(app.listen())

describe('Moodboard App',function(){
  var loggedInUserId;

  it('should be able to add a new user', function (done) {
    request.post('/api/user')
    .send({
      'firstName':'Squiggles',
      'lastName':'Sawtell-Smith',
      'userName':'squiggs',
      'email':'squiggs@pet.cat',
      'password':'squiggleCat123'
    })
    .expect(201)
    .end(done)
  });
 
  it('should not be able to add a new user with no firstName', function (done) {
    request.post('/api/user')
    .send({
      'firstName':'',
      'lastName':'Sawtell-Smith',
      'userName':'squiggs',      
      'email':'squiggs@cat.box',
      'password':'squiggleCat123'
    })
    .expect(400)
    .end(done)
  });
  it('should not be able to update an unauthenticated user',function (done) {
    const updatedUserData = {
      'firstName':'Squiggles',
      'lastName':'Sawtell-Smith',
      'userName':'squiggs',
      'email':'chicken.nugget@pet.cat',
    }
    request.put(`/api/user`)
    .send(updatedUserData)
    .expect(401)
    .end(done)
  })
  it('should be able to login with the correct username & password', function (done) {
    request.post('/api/login')
    .send({
      userName:'squiggs',
      password:'squiggleCat123'
    })
    .expect(200)
    .then(function(response){
      loggedInUserId = response.body._id;
      done()
    })
  })
  it('should be reject a login with the incorrect username', function (done) {
    request.post('/api/login')
    .send({
      userName:'squiggleCat',
      password:'squiggleCat123'
    })
    .expect(403)
    .end(done)
  })

  it('should be reject a login with the incorrect username and password', function (done) {
    request.post('/api/login')
    .send({
      userName:'squiggleCat',
      password:'squiggleCat444'
    })
    .expect(403)
    .end(done)
  })

  it('should be reject a login with the incorrect password', function (done) {
    request.post('/api/login')
    .send({
      userName:'squiggs',
      password:'squiggleCat444'
    })
    .expect(403)
    .end(done)
  })
  it('should be able to update authenticated user', function (done) {
    const updatedUserData = {
      'firstName':'Squiggles',
      'lastName':'Sawtell-Smith',
      'userName':'squiggs',
      'email':'chicken.nugget@pet.cat',
      '_id':loggedInUserId
    }
    request.put(`/api/user`)
    .send(updatedUserData)
    .expect(200,updatedUserData)
    .end(done)
  });
  
  it('should be able to look up users by id when logged in', function (done) {
    const updatedUserData = {
      'firstName':'Squiggles',
      'lastName':'Sawtell-Smith',
      'userName':'squiggs',
      'email':'chicken.nugget@pet.cat',
      '_id':loggedInUserId
    }
    request.get(`/api/user/${loggedInUserId}`)
    .expect(200,updatedUserData)
    .end(done)
  });
  it('should log the user out', function (done) {
    request.post('/api/logout')
    .expect(200)
    .end(done)
  })
})