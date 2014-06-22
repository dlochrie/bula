var request = require('supertest'),
    Seed = require('../../util/seed'),
    seed = new Seed(app, 'user'),
    sinon = require('sinon');


describe('Admin Controller', function() {
  describe('views', function() {
    beforeEach(function(done) {
      var req = app.request, res = app.response;
      req.session = {flash: null};
      res.locals = {messages: {error: ['This action is unauthorized.']}};
      app.request.flash = sinon.stub().returns();
      seed.setup(done);
    });

    afterEach(function(done) {
      seed.teardown(done);
    });

    it('should show the admin page if the user is logged-in', function(done) {
      app.set('SITE OWNERS', ['testing.tester@email.com']);
      var session = app.request.session = new app.session();
      session.logged_in.should.be.true;
      session.passport.should.be.an.Object;
      session.passport.should.have.property('user');
      request(app)
          .get('/admin')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.not.containEql('This action is unauthorized.');
            res.text.should.containEql('Admin Home');
            res.text.should.containEql('Manage Posts');
            res.text.should.containEql('Manage Users');
            done();
          });
    });

    it('should NOT show the admin page if the user is NOT logged-in',
       function(done) {
         request(app)
          .get('/admin')
          .expect(302)
          .end(function(err, res) {
           if (err) return done(err);
           request(app)
            .get('/')
            .expect(200)
            .end(function(err, res) {
             if (err) return done(err);
             res.text.should.containEql('This action is unauthorized.');
             done();
           });
         });
       });
  });
});
