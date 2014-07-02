var request = require('supertest'),
    bulaTest = app.test,
    seed = new bulaTest.seed(app, 'post', ['user']),
    sinon = require('sinon');


describe('Admin Posts Controller', function() {
  describe('views', function() {
    beforeEach(function(done) {
      seed.setup(done);
    });

    afterEach(function(done) {
      seed.teardown(done);
    });

    describe('when NOT logged-in', function() {
      beforeEach(function(done) {
        var req = app.request, res = app.response;
        req.session = {flash: null};
        res.locals = {messages: {error: ['This action is unauthorized.']}};
        app.request.flash = sinon.stub().returns();
        done();
      });

      it('should NOT show the admin posts page', function(done) {
        request(app).
            get('/admin/posts').
            expect(302).
            end(function(err, res) {
              if (err) return done(err);
              request(app).
                  get('/').
                  expect(200).
                  end(function(err, res) {
                    if (err) return done(err);
                    res.text.should.containEql('This action is unauthorized.');
                    done();
                  });
            });
      });
    });

    describe('when logged-in', function() {
      beforeEach(function(done) {
        app.set('SITE OWNERS', ['testing.tester@email.com']);
        var session = app.request.session = new bulaTest.authenticate();
        session.logged_in.should.be.true;
        session.passport.should.be.an.Object;
        session.passport.should.have.property('user');
        done();
      });

      afterEach(function(done) {
        var req = app.request, res = app.response;
        req.session = {flash: null};
        res.locals = {messages: {error: ['This action is unauthorized.']}};
        app.request.flash = sinon.stub().returns();
        done();
      });

      it('should show the admin posts page', function(done) {
        request(app).
            get('/admin/posts').
            expect(200).
            end(function(err, res) {
              if (err) return done(err);
              res.text.should.not.containEql('This action is unauthorized.');
              res.text.should.containEql('Posts Administration');
              res.text.should.not.containEql('No Posts Found.');
              res.text.should.containEql('First Post');
              res.text.should.containEql('Second Post');
              res.text.should.not.containEql('Third Post');
              done();
            });
      });

      describe('when creating a new post', function() {
        it('should show the new posts form', function(done) {
          request(app).
              get('/admin/posts/new').
              expect(200).
              end(function(err, res) {
                if (err) return done(err);
                res.text.should.
                    containEql('Create Post').
                    containEql('Title').
                    containEql('Author').
                    containEql('Description').
                    containEql('Content');
                done();
              });
        });

        it('should create a new post with valid content', function(done) {
          var post = {
            title: 'Third Post',
            user_id: 1,
            description_md: 'Some Description',
            body_md: 'Some Content'
          };
          request(app).
              post('/admin/posts').
              send(post).
              expect(302).
              end(function(err, res) {
                if (err) return done(err);
                request(app).
                    get('/admin/posts').
                    expect(200).
                    end(function(err, res) {
                      if (err) return done(err);
                      res.text.should.containEql('Third Post');
                      done();
                    });
              });
        });

        it('should notify the user when there\'s empty content',
            function(done) {
              // TODO: Pls implement.
              done();
            });
      });
    });
  });
});
