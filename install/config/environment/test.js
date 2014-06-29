/**
 * Test environment-specific settings and middleware. Modify this file as
 * necessary to override the core/middleware file or to append new middleware.
 *
 * For example, the default view engine is `jade`, but you can override that
 * setting here by adding:
 *
 *     app.set('view engine', 'ejs');
 *
 * If you wanted to use express logger middleware, you could register here like:
 *
 *     app.use(express.logger());
 *
 * CAUTION:
 * Order is extremely important here!!! Be careful when changing the
 * order of the middleware.
 *
 * @param {function(Object, Object, Function)} app Express application instance.
 * @param {Function} express Express/Connect instance.
 */
module.exports = function(app, express) {
  var express = require('express'),
      path = require('path'),
      rootPath = app.get('ROOT PATH'),
      RedisStore = require('connect-redis')(express);

  // Logs DB Queries to Console.
  app.set('LOG QUERIES', false);

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

  // Exposes the router. This should ALWAYS BE LOADED LAST to prevent issues
  // with flash messages, and session storage/retrieval, in addition to other
  // things.
  app.use(app.router);
};
