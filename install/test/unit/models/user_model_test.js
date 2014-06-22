var User = require('../../../app/models/user'),
    user;

describe('User Model', function() {
  before(function(done) {
    var resource = {};
    user = new User(app, resource);
    done();
  });

  it('should be an object with references to app and db', function(done) {
    User.should.be.a.function;
    user.should.be.a.Object;
    user.should.have.property('app');
    user.should.have.property('db');
    user.should.have.property('resource');
    user.app.should.be.a.function;
    done();
  });

  it('should inherit from the base model', function(done) {
    user.should.have.property('find');
    user.find.should.be.a.function;
    user.should.have.property('findOne');
    user.findOne.should.be.a.function;
    done();
  });

  it('should have getter methods', function(done) {
    user.should.have.property('getColumns');
    user.should.have.property('getQuery');
    user.should.have.property('getStructure');
    user.should.have.property('getTable');
    done();
  });

  it('should get a query', function(done) {
    user.getQuery('insert').should.equal('INSERT INTO `user` SET ?');
    user.getQuery('update').should.equal('UPDATE `user` SET ? WHERE ?');
    var allQueries = user.getQuery();
    allQueries.should.be.an.Object;
    allQueries.should.have.properties('find', 'findOne', 'insert');
    done();
  });

  it('should get columns for a model', function(done) {
    var columns = user.getColumns();
    columns.should.be.an.Array;
    columns.should.containEql('user.id', 'user.id');
    done();
  });

  it('should get the model\'s structure', function(done) {
    var structure = user.getStructure();
    structure.should.be.an.Object;
    structure.should.have.properties('id', 'displayName');
    structure.displayName.should.have.property('type', 'String');
    structure.displayName.should.have.property('required', true);
    done();
  });

  it('should get the model\'s table', function(done) {
    user.getTable().should.equal('user');
    done();
  });

  it('should prepare the resource', function(done) {
    user.resource.should.be.empty;
    var obj = user.prepare();
    obj.should.be.an.Object;
    obj.should.have.properties('created', 'updated', 'slug');
    obj.slug.should.be.empty;

    user.resource = {displayName: 'Testing Tester'};
    obj = user.prepare();
    obj.slug.should.equal('testing-tester');
    done();
  });
});
