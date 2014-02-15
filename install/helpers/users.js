module.exports = function(app) {
  /**
   * @constructor
   */
  app.locals.User = function() {};


  /**
   * Checks to see if the user is an Owner.
   * @return {boolean} Whether the user is an owner or not.
   */
  app.locals.User.isOwner = function(user) {
    if (!user) {
      return false;
    }
    return (app.get('SITE OWNERS').indexOf(user.email) !== -1);
  };
};
