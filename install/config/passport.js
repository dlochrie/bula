/**
 * Passport Authentication Module.
 * @param {function(Object, Object, Function)} app Express application instance.
 */
module.exports = function(app) {
  var passport = require('passport'),
      GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
      googleClientId = app.get('GOOGLE CLIENT ID'),
      googleClientSecret = app.get('GOOGLE CLIENT SECRET'),
      rootPath = app.get('ROOT PATH'),
      rootUrl = app.get('ROOT URL'),
      User = require(rootPath + 'app/models/user');


  function handleResponse(err, result, done) {
    if (!err) {
      done(null, result);
    } else {
      /**
       * First argument MUST be null/false or `failureFlash` won't fire.
       */
      done(null, result, {message: err});
    }
  }


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
   * Use the Google OpenId Strategy within Passport.
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
        return handleResponse(err, result.user, done);
      }
      user.resource = resource;
      return user.insert(function(err, result) {
        err = err ? 'There was an error creating the User: ' + err : false;
        result = result || null;
        handleResponse(err, result, done);
      });
    });
  }));


  /**
   * Authenticate the User against the Google OpenId API.
   */
  app.get('/auth/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]}));


  /**
   * Handle the Response from the Google OpenId API.
   */
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


  /**
   * Log the user completely out.
   * Regenerate a new session and set `logged_in` to false.
   */
  app.get('/logout', function(req, res) {
    var session = req.session;
    session.logged_in = false;
    req.logOut();
    if (!session || !session.regenerate) return res.redirect('/');
    session.regenerate(function(err) {
      res.redirect('/');
    });
  });
};
