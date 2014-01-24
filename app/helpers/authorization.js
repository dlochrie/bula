/**
 * The Authorize helper contains methods that check to see if a user is allowed
 * to perform certain actions.
 */
module.exports = function(app) {
  /**
   * @constructor
   */
  app.locals.Authorize = function() {};


  /**
   * Checks to see if the user is an Owner.
   * SITE OWNERS should be defined in an environmental variable, and are set
   * at runtime in `app|server.js`.
   * @return {boolean} Whether the user is an owner or not.
   */
  app.locals.Authorize.isOwner = function(user) {
    if (!user) return false;
    if (app.get('SITE OWNERS').indexOf(user.user_email) !== -1) {
      return true;
    }
    return false;
  };
};