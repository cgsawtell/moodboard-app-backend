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
      'username':'squiggs',
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
      'username':'squiggs',      
      'email':'squiggs@cat.box',
      'password':'squiggleCat123'
    })
    .expect(400)
    .end(done)
  });
  it('should be able to verify if a username is available', function (done) {
    request.get('/api/user/user/checkAvailability?username=piggle')
    .expect(204)
    .end(done)
  })
  it('should be able to verify if a username is unavailable', function (done) {
    request.get('/api/user/user/checkAvailability?username=squiggs')
      .expect(200)
      .end(done)
  })
  it('should be able to verify if a email is available', function (done) {
    request.get('/api/user/user/checkAvailability?email=piggle@pet.cat')
      .expect(204)
      .end(done)
  })
  it('should be return 400 if you try to check email and username', function (done) {
    request.get('/api/user/user/checkAvailability?username=squiggs&email=piggle@pet.cat')
      .expect(400)
      .end(done)
  })
  it('should be able to verify if a email is unavailable', function (done) {
    request.get('/api/user/user/checkAvailability?email=chicken.nugget@pet.cat')
      .expect(200)
      .end(done)
  })
  it('should not be able to update an unauthenticated user',function (done) {
    const updatedUserData = {
      'firstName':'Squiggles',
      'lastName':'Sawtell-Smith',
      'username':'squiggs',
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
      username:'squiggs',
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
      username:'squiggleCat',
      password:'squiggleCat123'
    })
    .expect(403)
    .end(done)
  })

  it('should be reject a login with the incorrect username and password', function (done) {
    request.post('/api/login')
    .send({
      username:'squiggleCat',
      password:'squiggleCat444'
    })
    .expect(403)
    .end(done)
  })

  it('should be reject a login with the incorrect password', function (done) {
    request.post('/api/login')
    .send({
      username:'squiggs',
      password:'squiggleCat444'
    })
    .expect(403)
    .end(done)
  })
  it('should be able to update authenticated user', function (done) {
    const updatedUserData = {
      'firstName':'Squiggles',
      'lastName':'Sawtell-Smith',
      'username':'squiggs',
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
      'username':'squiggs',
      'email':'chicken.nugget@pet.cat',
      '_id':loggedInUserId
    }
    request.get(`/api/user/${loggedInUserId}`)
    .expect(200,updatedUserData)
    .end(done)
  });
  it('should be able to create a new board', function (done) {
    request.post('/api/board')
    .send({name:"test board", description:"test board for testing reasons"})
    .expect(200)
    .end(done)
  })
  it('should log the user out', function (done) {
    request.post('/api/logout')
    .expect(200)
    .end(done)
  })
})