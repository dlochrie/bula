var request = require('supertest'),
    seed = require('../../util/seed');


describe('Posts Controller', function() {
  before(function(done) {
    seed.init(app, 'post', ['user']);
    seed.setup();
    done();
  });

  after(function(done) {
    seed.teardown();
    done();
  });

  describe('views', function() {
    it('should show the posts index', function(done) {
      request(app)
          .get('/posts')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('Description for First Post');
            res.text.should.include('Description for Second Post');
            done();
          });
    });

    it('should show a post', function(done) {
      request(app)
          .get('/posts/first-post')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('First Post');
            res.text.should.include('joe tester');
            res.text.should.include('Body for First Post');
            done();
          });
    });
  });
});
