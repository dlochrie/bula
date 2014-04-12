/**
 * Base Middleware Module.
 * This is where core middleware is registered.
 * CAUTION: Order is extremely important here!!! Be careful when changing the
 * order of the middleware.
 * @param {function(Object, Object, Function)} app Express application instance.
 */
module.exports = function(app) {
  var express = require('express'),
      flash = require('connect-flash'),
      passport = require('passport'),
      path = require('path'),
      rootPath = app.get('ROOT PATH'),
      RedisStore = require('connect-redis')(express);

  // Compress Pages and Assets for speed/performance.
  app.use(express.compress());
  app.use(express.static(path.join(rootPath, 'public')));

  // Set up  Body Parsing, omitting the Multipart middleware.
  // For more information, see: http://expressjs.com/api.html#bodyParser.
  app.use(express.json());
  app.use(express.urlencoded());

  // Allows us to use "Put", "Delete", and misc request verbs.
  app.use(express.methodOverride());

  // Setup Cookies and Session.
  app.use(express.cookieParser(app.get('COOKIE SECRET')));
  app.use(express.session({
    store: new RedisStore(),
    secret: app.get('REDIS SECRET')
  }));

  // Setup Passport Configuration.
  app.use(passport.initialize());
  app.use(passport.session());

  // Exposes the Flash Middleware to Views.
  app.use(flash());
  app.use(function loadFlash(req, res, next) {
    res.locals.messages = req.flash();
    next();
  });

  // Makes the User's Name available to Views.
  app.use(function loadUser(req, res, next) {
    if (req.session.logged_in) {
      res.locals.user = req.session.passport.user;
    }
    next();
  });

  // Exposes the router. This should ALWAYS BE LOADED LAST to prevent issues
  // with flash messages, and session storage/retrieval, in addition to other
  // things.
  app.use(app.router);
};
