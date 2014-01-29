/**
 * Base Initialization Module
 *
 * This module sets up the application definitions, and loads all required
 * core modules.
 *
 * If any error is encountered, this module should terminate the application.
 */
module.exports = function(app, express) {
  var dir = __dirname + '/core/',
      fs = require('fs');

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

  /**
   * Load all required core files.
   */
  var modules = fs.readdirSync(dir);
  modules.forEach(function(module) {
    require(dir + '/' + module)(app);
  });

  /**
   * Extract environmental variables.
   */
  var root = app.get('ROOT PATH'),
      env = app.get('NODE ENVIRONMENT');

  /**
   * Load application-specific config files (routes, etc).
   */
  var confs = fs.readdirSync(root + 'config');
  confs.forEach(function(conf) {
    var path = root + 'config/' + conf;
    if (fs.lstatSync(path).isFile() && conf !== 'routes.js') {
      require(path)(app);
    }
  });

  /**
   * (Optional)
   * Setup environment-specific settings.
   * For example, if you are adding a custom logger to Dev, but you don't want
   * to use it in Prod, then you can create a `dev` file for dev-specific
   * settings.
   */
  var conf = root + 'config/environment/' + env.toLowerCase() + '.js';
  if (fs.existsSync(conf) && fs.lstatSync(conf).isFile()) {
    require(conf)(app, express);
  }

  /**
   * Always load the Routes last.
   */
  require(root + 'config/routes.js')(app);
};
