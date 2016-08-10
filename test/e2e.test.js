var express = require('express');
var app = express();

require('../app')(app);
var supertest = require('supertest')(app)

describe('Routes', function() {
  describe('GET /', function() {
    it('responds with json message', function(done) {
      supertest.get('/')
      .expect(200)
      .expect({
        ok: true,
        message: 'send a multipart/form post with an image as the \'file\' parameter.'
      }, done)
    });
  })

  describe('POST /upload', function() {

    context('on success', function() {
      it('responds with image', function(done) {
        supertest.post('/upload')
          .attach('file', __dirname + '/img/boy_960x640.jpg')
          .expect('Content-Type', /image/)
          .expect(200,done)
      });
    });

    context('on failure due to undersized source image', function(done) {
      it('responds with json error message', function(done) {
        supertest.post('/upload')
        .attach('file', __dirname + '/img/boy_400x267.jpg')
        .expect('Content-Type', /json/)
        .expect(400,{
          ok: false,
          message: "Image must be at least 500 x 300 pixels"
        }, done)
      });
    });

      context('on failure due to sending wrong parameter name', function(done) {
        it('responds with json error message', function(done) {
          supertest.post('/upload')
          .attach('wrongnamebro', __dirname + '/img/boy_960x640.jpg')
          .expect('Content-Type', /json/)
          .expect(400,{
            ok: false,
            message: "send a multipart/form post with an image as the \'file\' parameter."
          }, done)
        });
      });

      context('on failure due to no image sent with file parameter', function(done) {
        it('responds with json error message', function(done) {
          supertest.post('/upload')
          .field('file', '')
          .expect('Content-Type', /json/)
          .expect(400,{
            ok: false,
            message: "no image specified for \'file\' parameter"
          }, done)
        });
      });

      context('on failure due to wrong mime type', function(done) {
        it('responds with json error message', function(done) {
          supertest.post('/upload')
          .attach('file', __dirname + '/img/bogus.txt')
          .expect('Content-Type', /json/)
          .expect(400,{
            ok: false,
            message: "Invalid file - please upload an image (.jpg, .png, .gif)."
          }, done)
        });
      });

  }); //end POST /upload
}); //end ROUTES