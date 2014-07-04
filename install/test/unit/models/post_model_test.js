var Post = require('../../../app/models/post'),
    post;

describe('Post Model', function() {
  before(function(done) {
    var resource = {};
    post = new Post(app, resource);
    done();
  });

  it('should be an object with references to app and db', function(done) {
    Post.should.be.a.function;
    post.should.be.a.Object;
    post.should.have.property('app');
    post.should.have.property('db');
    post.should.have.property('resource');
    done();
  });

  it('should inherit from the base model', function(done) {
    post.should.have.property('find');
    post.find.should.be.a.function;
    post.should.have.property('findOne');
    post.findOne.should.be.a.function;
    done();
  });

  it('should get a query', function(done) {
    post.getQuery('insert').should.equal('INSERT INTO `post` SET ?');
    post.getQuery('update').should.equal('UPDATE `post` SET ? WHERE ?');
    var allQueries = post.getQuery();
    allQueries.should.be.an.Object;
    allQueries.should.have.properties('find', 'findOne', 'insert');
    done();
  });

  it('should get columns for a model', function(done) {
    var columns = post.getColumns();
    columns.should.be.an.Array;
    columns.should.containEql('post.id', 'user.id');
    done();
  });

  it('should get the model\'s structure', function(done) {
    var structure = post.getStructure();
    structure.should.be.an.Object;
    structure.should.have.properties('id', 'user_id');
    structure.id.should.have.property('type', 'Number');
    structure.user_id.should.have.property('type', 'Number');
    structure.user_id.should.have.property('displayName', 'User');
    done();
  });

  it('should get the model\'s table', function(done) {
    post.getTable().should.equal('post');
    done();
  });

  it('should prepare the resource', function(done) {
    post.resource.should.be.empty;
    var obj = post.prepare();
    obj.should.be.an.Object;
    obj.should.have.properties('created', 'updated', 'slug', 'body');
    obj.body.should.be.empty;
    obj.slug.should.match(/^\d+$/);

    post.resource = {
      body_md: '# Header\n## SubHeading',
      title: 'Test Article'
    };
    obj = post.prepare();
    obj.body.should.equal('<h1 id=\"header\">Header</h1>\n' +
        '<h2 id=\"subheading\">SubHeading</h2>\n');
    obj.slug.should.equal('test-article');
    done();
  });
});
