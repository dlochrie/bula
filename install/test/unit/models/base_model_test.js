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
        'update', 'save', 'remove', 'select', 'validate', 'getQueryObject');
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
    // beforeEach(function(done) {
    //   base.getQuery = sinon.stub().returns(Post.QUERIES_.findOne);
    //   done();
    // });

    // it('should find a record if one exists', function(done) {
    //   var resource = {id: 1, title: 'First Post'};
    //   base.findOrCreate(resource, function(err, result) {
    //     (err === null).should.be.true;
    //     console.log('result', result);
    //     // resource.should.eql(result);
    //     done();
    //   });
    // });

    // it('should create a new record if one does not exist', function(done) {
    //   var resource = {title: 'Something New'};
    //   base.findOrCreate(resource, function(err, result) {
    //     console.log('result', result);
    //     (err === null).should.be.true;
    //     resource.should.eql(result);
    //     done();
    //   });
    // });
  });
});
