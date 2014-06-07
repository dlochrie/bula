var request = require('supertest'),
    Seed = require('../../util/seed'),
    seed = new Seed(app, 'post', ['user']);


describe('Posts Controller', function() {
  describe('views', function() {
    beforeEach(function(done) {
      seed.setup(done);
    });

    afterEach(function(done) {
      seed.teardown(done);
    });

    it('should show the posts index', function(done) {
      request(app)
          .get('/posts')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.containEql('Description for First Post');
            res.text.should.containEql('Description for Second Post');
            done();
          });
    });

    it('should show a post', function(done) {
      request(app)
          .get('/posts/first-post')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.containEql('First Post');
            res.text.should.containEql('joe tester');
            res.text.should.containEql('Body for First Post');
            done();
          });
    });
  });
});
