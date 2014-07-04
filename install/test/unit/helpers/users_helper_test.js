var UsersHelper = require('../../../app/helpers/users');

describe('Users Helper', function() {
  var user = {email: null};

  it('verify that a logged in user is an owner', function(done) {
    // With one owner.
    app.set('SITE OWNERS', ['testing.tester@email.com']);
    user.email = 'testing.tester@email.com';
    UsersHelper.isOwner(user).should.be.true;
    user.email = 'someone@email.com';
    UsersHelper.isOwner(user).should.be.false;
    user.email = null;
    UsersHelper.isOwner(user).should.be.false;
    user.email = undefined;
    UsersHelper.isOwner(user).should.be.false;
    user.email = '';
    UsersHelper.isOwner(user).should.be.false;
    user.email = [];
    UsersHelper.isOwner(user).should.be.false;
    // With multiple owner.
    app.set('SITE OWNERS', [
      'testing.tester@email.com',
      'no.one@email.com',
      'someoneelse@email.com'
    ]);
    user.email = 'no.one@email.com';
    UsersHelper.isOwner(user).should.be.true;
    user.email = 'someone@email.com';
    UsersHelper.isOwner(user).should.be.false;
    done();
  });
});
