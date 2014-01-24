/**
 * Main router module.
 */
module.exports = function(app) {
  var dir = app.get('ROOT PATH') + 'app/controllers/',
    main = require(dir + 'main'),
    admin = require(dir + 'admin');

  /**
   * Public Routes.
   */
  app.get('/', main.index);
  //app.get('/login', main.login);

  /**
   * Authenticate all `admin` routes with authentication middleware.
   *
   * TODO(dlochrie) This is a temporary admin check, but it needs to be
   * expanded on and refactored.
   */
  //app.all('/admin*', admin.authenticate);

  /**
   * Admin Routes.
   * Should be protected by authentication middleware above.
   */
  //app.resource('admin', admin);
};