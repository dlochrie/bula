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
   * to use it in Prod.
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