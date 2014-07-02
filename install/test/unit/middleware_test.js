/**
 * These tests do not test that Express/Connect/Passport/etc middleware is
 * working/loaded as needed - only that `custom` middleware is working/loaded.
 */
var express = require('express'),
    request = require('supertest'),
    should = require('should'),
    app = express();


/**
 * Tests that `flash` is available to the session.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 * @param {Function} next Callback function.
 */
function testConnectFlash(req, res, next) {
  res.locals.messages.should.be.an.Object;
  req.session.flash.should.be.an.Object;
  res.locals.messages.should.eql(req.session.flash);
  next();
}


/**
 * Tests that the `user` locals var is set, which requires custom middleware.
 * This DOES NOT test authentication -- ONLY that if the `logged_in` property is
 * set to true on the session, that the local `user` var will be set.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 * @param {Function} next Callback function.
 */
function testLoadUserLocal(req, res, next) {
  req.session.passport.should.be.an.Object;
  (res.locals.user === req.session.passport.user).should.be.true;
  next();
}

// Set up the tests.
require('bula-test')(app);
var bulaTest = app.test;
app.set('ROOT PATH', '/test/path');
app.set('REDIS SECRET', 'test-secret');
require('../../config/environment/dev')(app);

// Enable the test middleware - required to access the `req` request objects.
// This middleware needs to be registered in order for the test suite below
// to have access to the middleware.
app.use(testConnectFlash);
app.use(testLoadUserLocal);

describe('Core middleware module', function() {
  beforeEach(function(done) {
    var session = app.request.session = new bulaTest.authenticate();
    session.logged_in.should.be.true;
    session.passport.should.be.an.Object;
    session.passport.should.have.property.user;
    done();
  });

  it('should register the core middleware', function(done) {
    request(app)
      .get('/')
      .end(done);
  });
});
