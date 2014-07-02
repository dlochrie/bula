var request = require('supertest'),
    bulaTest = app.test,
    seed = new bulaTest.seed(app, 'user');


describe('Authentication Controller', function() {
  beforeEach(function(done) {
    seed.setup(done);
  });

  afterEach(function(done) {
    seed.teardown(done);
  });

  describe('when not logged in', function() {
    it('should show a login link have no session', function(done) {
      request(app).
          get('/').
          expect(200).
          end(function(err, res) {
            if (err) return done(err);
            res.text.should.containEql('login');
            res.text.should.not.containEql('Testing Tester');
            res.text.should.not.containEql('logout');
            res.text.should.containEql('login');
            done();
          });
    });
  });

  describe('when logged in', function() {
    var session, user;

    beforeEach(function(done) {
      session = app.request.session = new bulaTest.authenticate();
      session.logged_in.should.be.true;
      session.passport.should.be.an.Object;
      session.passport.should.have.property('user');
      user = session.passport.user;
      done();
    });

    it('should populate the users object', function(done) {
      user.displayName.should.eql('Testing Tester');
      user.email.should.eql('testing.tester@email.com');
      user.slug.should.eql('testing-tester');
      done();
    });

    it('should show the user\s name and a logout link', function(done) {
      app.response.locals.should.have.property('user');
      request(app).
          get('/').
          expect(200).
          end(function(err, res) {
            if (err) return done(err);
            res.text.should.containEql('Testing Tester');
            res.text.should.containEql('logout');
            res.text.should.not.containEql('login');
            done();
          });
    });

    it('should successfully log a user out', function(done) {
      app.response.locals.should.have.property('user');
      session.passport.should.have.property('user');
      session.logged_in.should.be.true;
      request(app).
          get('/logout').
          expect(302). // Logging out redirects.
          end(function(err, res) {
            if (err) return done(err);
            request(app).get('/').
                expect(200).
                end(function(err, res) {
                  if (err) return done(err);
                  res.text.should.not.containEql('Testing Tester');
                  res.text.should.not.containEql('logout');
                  res.text.should.containEql('login');
                  session.logged_in.should.be.false;
                  session.passport.should.not.have.property('user');
                  app.response.locals.should.not.have.property('user');
                  done();
                });
          });
    });
  });
});
