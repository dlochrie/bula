var request = require('supertest'),
    Seed = require('../../util/seed'),
    seed = new Seed(app, 'post', ['user']);


describe('Main Controller', function() {
  describe('views', function() {
    beforeEach(function(done) {
      seed.setup(done);
    });

    afterEach(function(done) {
      seed.teardown(done);
    });

    it('should show the home page with posts', function(done) {
      request(app)
          .get('/')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.containEql('Next Steps');
            res.text.should.containEql('Description for First Post');
            res.text.should.containEql('Description for Second Post');
            done();
          });
    });

    it('should show an about page', function(done) {
      request(app)
          .get('/about')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.containEql('About');
            res.text.should.containEql(
                'This page describes what our website and/or organization is ' +
                'about.');
            done();
          });
    });

    it('should show a contact page', function(done) {
      request(app)
          .get('/contact')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.containEql('Contact');
            res.text.should.containEql(
                'This page describes how our visitors can get in touch with us.');
            done();
          });
    });

    it('should show a login page with a link to login with a google account',
       function(done) {
         request(app)
            .get('/login')
            .expect(200)
            .end(function(err, res) {
           if (err) return done(err);
           res.text.should.containEql('Login');
           res.text.should.containEql(
           'Click <a href="/auth/google">here</a> to login using your ' +
           'Google Account.');
           done();
         });
       });
  });
});
