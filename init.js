/**
 * Base Initialization Module
 *
 * This module sets up the application definitions, and loads all required
 * core modules.
 *
 * If any error is encountered, this module should terminate the application.
 */
module.exports = function(app) {
  var dir = __dirname + '/core/',
    fs = require('fs');

  /**
   * Initialize all required application variables.
   * This does not need to be asynchronous because it only runs on startup.
   */


  /**
   * Load all required core files.
   */
  var modules = fs.readdirSync(dir);
  modules.forEach(function(module) {
    require(dir + '/' + module)(app);
  });

  var root = app.get('ROOT PATH');

  /**
   * Load application-specific config files (routes, etc).
   */
  var confs = fs.readdirSync(root + 'config');
  confs.forEach(function(conf) {
    require(root + 'config/' + conf)(app);
  });
};