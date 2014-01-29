/**
 * Main router module.
 * Add your routes here.
 */
module.exports = function(app) {
  // TODO: Maybe just loop through controllers??
  var dir = app.get('ROOT PATH') + 'app/controllers/',
      main = require(dir + 'main'),
      admin = require(dir + 'admin'),
      users = require(dir + 'users');

  /**
   * Public Routes.
   */
  app.get('/', main.index);
  app.get('/about', main.about);
  app.get('/contact', main.contact);
  app.get('/login', main.login);

  /**
   * Authenticate all `admin` routes with authentication middleware.
   *
   * TODO: This is a temporary admin check, but it needs to be
   * expanded on and refactored.
   */
  app.all('/admin*', users.authenticate);

  /**
   * Admin Routes.
   * Should be protected by authentication middleware above.
   */
  //app.resource('admin', admin);
};
