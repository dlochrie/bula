/**
 * Expose `Routes` Module.
 */
module.exports = Routes;



/**
 * Main router module.
 * Add your routes here.
 * @param {function(Object, Object, Function)} app Express application instance.
 * @constructor
 */
function Routes(app) {
  // TODO: Maybe just loop through controllers??
  var dir = app.get('ROOT PATH') + 'app/controllers/',
      main = require(dir + 'main'),
      users = require(dir + 'users'),
      posts = require(dir + 'posts'),
      admin = require(dir + 'admin'),
      adminPosts = require(dir + 'admin/posts'),
      adminUsers = require(dir + 'admin/users');

  /**
   * Public Routes.
   */
  var staticRoutes = Routes.StaticRoutes_;
  app.get(staticRoutes.SITE_HOME, main.index);
  app.get(staticRoutes.SITE_ABOUT, main.about);
  app.get(staticRoutes.SITE_CONTACT, main.contact);
  app.get(staticRoutes.SITE_LOGIN, main.login);

  /**
   * Public Resources.
   */
  app.resource('posts', posts);
  app.resource('users', users);

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
  app.resource('admin', admin);
  app.resource('admin/posts', adminPosts);
  app.get('/admin/posts/:post/delete', adminPosts.delete);
  app.resource('admin/users', adminUsers);
  app.get('/admin/users/:user/delete', adminUsers.delete);

  // TODO: Move this logic to a controller!!!!
  // Authenticate the User against the Google OAuth2 API.
  app.get('/auth/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]}));

  // TODO: Move this logic to a controller!!!!
  // Handle the Response from the Google OAuth2 API.
  app.get('/auth/google/callback', passport.authenticate('google', {
    failureFlash: true,
    failureRedirect: '/login'
  }), function(req, res) {
    var session = req.session;
    if (session.passport.user) {
      session.logged_in = true;
    }
    res.redirect('/');
  });

  // TODO: Move this logic to a controller!!!!
  // Log the user completely out.
  // Regenerate a new session and set `logged_in` to false.
  app.get('/logout', function(req, res) {
    var session = req.session;
    session.logged_in = false;
    req.logOut();
    if (!session || !session.regenerate) return res.redirect('/');
    session.regenerate(function(err) {
      res.redirect('/');
    });
  });

  // Define the static routes that Express Resource does NOT provide us
  // automatically.
  app.set('STATIC_ROUTES', staticRoutes);
}


/**
 * Static Routes should be defined here for use in controllers and other parts
 * of the application.
 * @enum {string}
 * @private
 */
Routes.StaticRoutes_ = {
  SITE_HOME: '/',
  SITE_ABOUT: '/about',
  SITE_CONTACT: '/contact',
  SITE_LOGIN: '/login'
};
