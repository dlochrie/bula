/**
 * Expose the Authenticate configuration.
 * @export
 */
module.exports = Authenticate;



/**
 * Registers configuration for Passport providers. If you want to add additional
 * providers, restister them here with the `passport.use` middleware, and add
 * the handling logic to the authentication module.
 * @param {function(Object, Object, Function)} app Express application instance.
 * @constructor
 */
function Authenticate(app) {
  var Auth = require('bula-auth'),
      auth = new Auth(app),
      passport = require('passport'),
      GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
      rootPath = app.get('ROOT PATH'),
      rootUrl = app.get('ROOT URL'),
      User = require(rootPath + 'app/models/user'),
      authentication = require(rootPath + 'app/controllers/authentication');

  /**
   * Register Serialization and Deserialization logic for all passport
   * providers.
   */
  passport.serializeUser(auth.serializeUser);
  passport.deserializeUser(auth.deserializeUser);

  /**
   * Use the Google OAuth2 Strategy within Passport for Google Authentication.
   */
  passport.use(new GoogleStrategy({
    clientID: app.get('GOOGLE CLIENT ID'),
    clientSecret: app.get('GOOGLE CLIENT SECRET'),
    callbackURL: rootUrl + 'auth/google/callback'
  }, function(accessToken, refreshToken, profile, done) {
    var resource = {
      displayName: profile.displayName,
      google_id: profile.id,
      email: profile.emails[0].value
    };

    var user = new User(app, {email: resource.email});
    user.findOrCreate(resource, function(err, result) {
      auth.handleResponse(err, result.user, done);
    });
  }));

  /**
   * Authentication Routes.
   *
   * If you want to add additional Passport authentication providers, add
   * those routes here.
   */
  app.get('/auth/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]}));

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

  app.get('/logout', authentication.logout);
}
