module.exports = function(app) {
  var auth = require('bula-auth'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    // TODO: Should these be registered elsewhere???
    googleClientId = app.get('GOOGLE CLIENT ID'),
    googleClientSecret = app.get('GOOGLE CLIENT SECRET'),
    rootPath = app.get('ROOT PATH'),
    rootUrl = app.get('ROOT URL'),
    User = require(rootPath + 'app/models/user');

  /**
   * Serialize the user into the session.
   */
  passport.serializeUser(function(user, done) {
    done(null, user);
  });


  /**
   * Deserialize the user out of the session.
   */
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });


  /**
   * Use the Google OAuth2 Strategy within Passport.
   */
  passport.use(new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: rootUrl + 'auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    var resource = {
      displayName: profile.displayName,
      google_id: profile.id,
      email: profile.emails[0].value
    };

    var user = new User(app, {email: resource.email});
    user.findOne(function(err, result) {
      if (err || result) {
        auth.handleResponse(err, result.user, done);
      } else {
        user.resource = resource;
        user.insert(function(err, result) {
          err = err ? 'There was an error creating the User: ' + err : false;
          result = result || null;
          auth.handleResponse(err, result, done);
        });
      }
    });
  }));
};
