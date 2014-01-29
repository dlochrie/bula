module.exports = function(app) {
  var flash = require('connect-flash'),
      express = require('express'),
      path = require('path'),
      passport = require('passport'),
      RedisStore = require('connect-redis')(express),
      rootPath = app.get('ROOT PATH');

  /**
   * Compress Pages and Assets for speed/performance.
   */
  app.use(express.compress());
  app.use(express.static(path.join(rootPath, 'public')));
  app.set('views', rootPath + '/app/views');
  app.set('view engine', 'jade');

  /**
   * Set up  Body Parsing, omitting the Multipart middleware.
   * For more information, see: http://expressjs.com/api.html#bodyParser.
   */
  app.use(express.json());
  app.use(express.urlencoded());

  // Allows us to use "Put", "Delete", and misc request verbs.
  app.use(express.methodOverride());

  /**
   * Setup Cookies and Session.
   */
  app.use(express.cookieParser(app.get('COOKIE SECRET')));
  app.use(express.session({
    store: new RedisStore(),
    secret: app.get('REDIS SECRET')
  }));

  /**
   * Setup Passport Configuration.
   */
  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * Expose Flash Middleware to Views.
   * TODO: This should be abstracted out.
   */
  app.use(flash());
  app.use(function(req, res, next) {
    res.locals.messages = req.flash();
    next();
  });

  /**
   * Make the User's Name available to Views
   * TODO: Is this necessary every request???
   */
  app.use(function(req, res, next) {
    if (req.session.logged_in) {
      res.locals.user = req.session.passport.user;
    }
    next();
  });

  app.use(app.router);
};
