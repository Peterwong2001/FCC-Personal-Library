/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

chai.use(chaiHttp);

let id = '';

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  */
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .keepOpen()
          .post('/api/books')
          .send( { title: 'test title' } )
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'test title');
            assert.isNotNull(res.body._id);
            id = res.body._id;
            done();
          })
          
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .keepOpen()
          .post('/api/books')
          .send( { title: '' } )
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field title');
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .keepOpen()
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .keepOpen()
          .get('/api/books/id')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .keepOpen()
          .get('/api/books/' + id)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'test title');
            assert.equal(res.body._id, id);
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .keepOpen()
          .post('/api/books/' + id)
          .send( { comment: 'test comment' } )
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'test title');
            assert.equal(res.body._id, id);
            assert.isArray(res.body.comments, 'response should be an array');
            assert.equal(res.body.comments[0], 'test comment');
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .keepOpen()
          .post('/api/books/' + id)
          .send( { comment: '' } )
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field comment');
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .keepOpen()
          .post( '/api/books/' + 'invalidId' )
          .send( { comment: 'test comment' } )
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .keepOpen()
          .delete( '/api/books/' + id )
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .keepOpen()
          .delete( '/api/books/' + 'invalidId' )
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
          })
      });

    });

  });

});
