// Expose 'Session' module.
module.exports = Session;



/**
 * Create a mock session class and expose it to `app`.
 * @constructor
 */
function Session() {
  this.logged_in = true;
  this.passport = app.response.locals = {user: Session.DEFAULT_TESTING_USER_};
}


/**
 * Default User for Tests.
 * @enum
 * @private
 */
Session.DEFAULT_TESTING_USER_ = {
  id: 1,
  displayName: 'Testing Tester',
  slug: 'testing-tester',
  email: 'testing.tester@email.com',
  created: '2014-06-15T20:47:59.000Z',
  updated: '2014-06-15T20:47:59.000Z'
};
