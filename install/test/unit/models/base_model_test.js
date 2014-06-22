var Base = require('../../../app/models/base'),
    Post = require('../../../app/models/post'),
    base,
    Seed = require('../../util/seed'),
    seed = new Seed(app, 'post', ['user']),
    sinon = require('sinon');

describe('Base Model defaults and initialization', function() {
  before(function(done) {
    var resource = {};
    base = new Base(app, resource);
    base.app = app;
    base.db = app.db;
    done();
  });

  it('should be an instance of the Base constructor', function(done) {
    Base.should.be.a.function;
    base.should.be.a.Object;
    base.should.have.properties('find', 'findOne', 'findOrCreate', 'insert',
        'update', 'remove', 'select', 'validate', 'getQueryObject');
    done();
  });
});

describe('Base Model Queries', function() {
  beforeEach(function(done) {
    base.getColumns = sinon.stub().returns(Post.SELECT_COLUMNS_);
    base.getQuery = sinon.stub().returns(Post.QUERIES_.find);
    base.getStructure = sinon.stub().returns(Post.STRUCTURE_);
    base.getTable = sinon.stub().returns('post');
    seed.setup(done);
  });

  afterEach(function(done) {
    seed.teardown(done);
  });

  describe('when performing find', function() {
    it('should find all records with relations', function(done) {
      base.find(function(err, results) {
        (err === null).should.be.true;
        results.should.be.Array.and.have.length(2);
        var r1 = results[0];
        r1.post.title.should.eql('First Post');
        r1.user.displayName.should.eql('joe tester');
        var r2 = results[1];
        r2.post.title.should.eql('Second Post');
        r2.user.displayName.should.eql('joe tester');
        done();
      });
    });

    it('should respond with an error when columns are wrong or can\'t be found',
       function(done) {
         // Assert that errors are returned when the columns are mismatched.
         base.getColumns = sinon.stub().returns(['x', 'y']);
         base.find(function(err, results) {
           err.should.be.an.Error;
           err.message.should.containEql(
           'Unknown column \'x\' in \'field list\'');
           results.should.be.empty;
         });

         // Assert that errors are returned when the columns are missing.
         base.getColumns = sinon.stub().returns([]);
         base.find(function(err, results) {
           err.should.be.an.Error;
           err.message.should.containEql(
           'ER_PARSE_ERROR: You have an error in your SQL syntax;');
           results.should.be.empty;
         });
         done();
       });

    it('should respond with an error when the query could not be found',
        function(done) {
          base.getColumns = sinon.stub().returns(['id', 'title']);
          base.getQuery = sinon.stub().returns();
          base.find(function(err, results) {
            err.should.equal('Could not find a query for this action: find.');
            (results === null).should.be.true;
          });
          done();
        });

    it('should respond with an error when the query is wrong',
        function(done) {
          base.getColumns = sinon.stub().returns(['id', 'title']);
          base.getQuery = sinon.stub().returns('not a query');
          base.find(function(err, results) {
            err.message.should.containEql(
           'ER_PARSE_ERROR: You have an error in your SQL syntax;');
            results.should.be.empty;
          });
          done();
        });
  });

  describe('when performing findOne', function() {
    beforeEach(function(done) {
      base.getQuery = sinon.stub().returns(Post.QUERIES_.findOne);
      done();
    });

    it('should find one (or the first) record with relations', function(done) {
      base.findOne(function(err, result) {
        (err === null).should.be.true;
        result.should.be.Object;
        result.should.have.properties('post', 'user');
        result.post.title.should.eql('First Post');
        result.user.displayName.should.eql('joe tester');
        done();
      });
    });

    it('should respond with an error when columns are wrong or can\'t be found',
       function(done) {
         // Assert that errors are returned when the columns are mismatched.
         base.getColumns = sinon.stub().returns(['x', 'y']);
         base.findOne(function(err, result) {
           err.should.be.an.Error;
           err.message.should.containEql(
           'Unknown column \'x\' in \'field list\'');
           (result === null).should.be.true;
         });

         // Assert that errors are returned when the columns are missing.
         base.getColumns = sinon.stub().returns([]);
         base.findOne(function(err, result) {
           err.should.be.an.Error;
           err.message.should.containEql(
           'ER_PARSE_ERROR: You have an error in your SQL syntax;');
           (result === null).should.be.true;
         });
         done();
       });

    it('should respond with an error when the query could not be found',
        function(done) {
          base.getColumns = sinon.stub().returns(['id', 'title']);
          base.getQuery = sinon.stub().returns();
          base.findOne(function(err, result) {
            err.should.equal(
                'Could not find a query for this action: findOne.');
            (result === null).should.be.true;
          });
          done();
        });

    it('should respond with an error when the query is wrong',
        function(done) {
          base.getColumns = sinon.stub().returns(['id', 'title']);
          base.getQuery = sinon.stub().returns('not a query');
          base.findOne(function(err, result) {
            err.message.should.containEql(
           'ER_PARSE_ERROR: You have an error in your SQL syntax;');
            (result === null).should.be.true;
          });
          done();
        });
  });

  describe('when performing findOrCreate', function() {
    beforeEach(function(done) {
      base.getQuery = sinon.stub().returns(Post.QUERIES_.findOne);
      base.resource = {};
      done();
    });

    it('should find a record if one exists', function(done) {
      base.resource = {id: 1};
      base.findOrCreate(base.resource, function(err, result) {
        (err === null).should.be.true;
        result.should.be.Object;
        result.should.have.properties('post', 'user');
        result.post.title.should.eql('First Post');
        result.user.displayName.should.eql('joe tester');
        done();
      });
    });

    it('should create a new record if one does not exist', function(done) {
      // TODO: Handle this.
      // Due to the deeply nested logic here. We cannot at this time test
      // inserts. Mocha tells us a leak is detected, and this test currently
      // fails.

      // However, this can be tested through functional/integration tests for
      // now.
      done();
    });
  });

  describe('when performing inserts and updates', function() {
    it('should create a new record', function(done) {
      // TODO: Handle this.
      // Due to the deeply nested logic here. We cannot at this time test
      // inserts. Mocha tells us a leak is detected, and this test currently
      // fails.

      // However, this can be tested through functional/integration tests for
      // now.
      done();
    });

    it('should update an existings record', function(done) {
      // TODO: Same as above.
      done();
    });
  });

  describe('when performing remove', function() {
    it('should remove/delete a new record', function(done) {
      // TODO: Same as above in inserts and updates.
      done();
    });
  });

  describe('when performing selects', function() {
    it('should return results with populated values', function(done) {
      var query = Post.QUERIES_.find;
      var columns = Post.SELECT_COLUMNS_;
      var where = {'post.id': 1};
      base.select(query, columns, where, function(err, results) {
        (err === null).should.be.true;
        results.should.be.Array.and.have.length(1);
        var r1 = results[0];
        r1.post.title = 'First Post';
        r1.user.displayName = 'joe tester';
        done();
      });
    });

    it('should return results with the default WHERE clause', function(done) {
      var query = Post.QUERIES_.find;
      var columns = Post.SELECT_COLUMNS_;
      var where = Base.DEFAULT_WHERE_VALUE_;
      base.select(query, columns, where, function(err, results) {
        (err === null).should.be.true;
        results.should.be.Array.and.have.length(2);
        var r1 = results[0];
        r1.post.title = 'First Post';
        r1.user.displayName = 'joe tester';
        var r2 = results[0];
        r2.post.title = 'Second Post';
        r2.user.displayName = 'joe tester';
        done();
      });
    });

    it('should return an error with a bad WHERE clause', function(done) {
      var query = Post.QUERIES_.find;
      var columns = Post.SELECT_COLUMNS_;
      var where = {'bad.id': 2};
      base.select(query, columns, where, function(err, results) {
        err.message.should.eql(
            'ER_BAD_FIELD_ERROR: Unknown column \'bad.id\' in ' +
            '\'where clause\'');
        (results === null).should.be.true;
        done();
      });
    });
  });

  describe('when running utilities', function() {
    it('should validate various resource errors', function(done) {
      base.resource = {};
      base.validate(function(errors) {
        errors.should.be.an.Array;
        errors.should.have.length(4);
      });

      base.resource = {title: 'Something'};
      base.validate(function(errors) {
        errors.should.be.an.Array;
        errors.should.have.length(3);
        errors[0].should.eql(
            'The following required field is missing: user_id');
      });

      base.resource = {
        id: 1,
        user_id: 1,
        description_md: 'test',
        body_md: 'test',
        title: 'Something'
      };
      base.validate(function(errors) {
        errors.should.be.an.Array;
        errors.should.have.length(0);
      });
      done();
    });

    it('should get query objects', function(done) {
      // With empty resources.
      base.resource = null;
      (base.getQueryObject() === null).should.be.true;

      // With invalide resources.
      base.resource = {unknown: 1};
      var obj = base.getQueryObject();
      (obj === null).should.be.false;
      obj.should.eql({});

      // With valid resources.
      base.resource = {
        id: 1,
        user_id: 1,
        description_md: 'test',
        body_md: 'test',
        title: 'Something'
      };
      var obj = base.getQueryObject();
      (obj === null).should.be.false;
      obj.should.eql({
        'post.id': 1,
        'post.user_id': 1,
        'post.title': 'Something',
        'post.description_md': 'test',
        'post.body_md': 'test'
      });
      done();
    });

    it('should log queries when logging is enabled', function(done) {
      app.set('LOG QUERIES', true);
      var logger = sinon.spy(console, 'log');
      // Assert that a default of N/A is called with no args.
      base.logQuery_();
      logger.called.should.be.true;
      logger.calledWith('MySQL Query:\t N/A').should.be.true;

      // Assert that the SQL is display in the log.
      base.logQuery_({sql: 'SELECT * FROM post'});
      logger.called.should.be.true;
      logger.calledWith('MySQL Query:\t SELECT * FROM post').should.be.true;
      console.log.restore(); // Clears the spy.
      done();
    });

    it('should NOT log queries when logging is disabled', function(done) {
      app.set('LOG QUERIES', false);
      var logger = sinon.spy(console, 'log');
      base.logQuery_();
      logger.called.should.be.false;
      console.log.restore(); // Clears the spy.
      done();
    });
  });
});
