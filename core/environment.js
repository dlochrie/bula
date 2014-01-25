module.exports = function(app) {
  var flash = require('connect-flash'),
    express = require('express'),
    path = require('path'),
    passport = require('passport'),
    RedisStore = require('connect-redis')(express);

  /**
   * Set up site globals - these are based off of Environmental variables.
   */
  var env = (process.env.NODE_ENV || 'dev').toUpperCase();
  app.set('NODE ENVIRONMENT', env);
  app.set('NODE PORT', process.env[env + '_NODE_PORT'] || 3000);
  app.set('NODE HOST', process.env[env + '_NODE_HOST'] || '0.0.0.0');
  app.set('ROOT PATH', process.env[env + '_ROOT_PATH']);
  app.set('ROOT URL', process.env[env + '_ROOT_URL']);
  app.set('COOKIE SECRET', process.env[env + '_COOKIE_SECRET']);
  app.set('REDIS SECRET', process.env[env + '_REDIS_SECRET']);
  app.set('SITE OWNERS', process.env.SITE_OWNERS);

  // TODO: IS THIS NECESSARY? IF THIS IS BEHIND NGINX????
  app.use(express.static(app.root + '/public', {
    maxAge: 86400000
  }));

  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');

  // TODO? IS THIS EDITABLE?
  app.use(express.favicon());

  // TODO: Do these 2 replace bodyparser?
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(express.methodOverride());


  app.use(express.cookieParser(app.get('COOKIE SECRET')));
  app.use(express.session({
    store: new RedisStore(),
    secret: app.get('REDIS SECRET')
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * Expose Flash Middleware to Views.
   */
  app.use(flash());
  app.use(function(req, res, next) {
    res.locals.messages = req.flash();
    next();
  });

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
};