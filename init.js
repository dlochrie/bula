var util = require('util');


/**
 * Base Initialization Module
 *
 * This module sets up the application definitions, and loads all required
 * core modules.
 *
 * If any error is encountered, this module should terminate the application.
 * @export
 */
module.exports = Bula;



/**
 * Constructor for the Bula Initializer.
 * @param {function(Object, Object, Function)} app Express application instance.
 * @param {Function} express Express/Connect instance.
 * @constructor
 */
function Bula(app, express) {
  var dir = __dirname + '/core/',
      fs = require('fs');

  // Load all required core files. Order is important.
  var modules = [
    'environment',
    'middleware'
  ];
  modules.forEach(function(module) {
    require(dir + '/' + module)(app);
  });

  var root = app.get('ROOT PATH'),
      env = app.get('NODE ENVIRONMENT'),
      conf = root + 'config/environment/' + env.toLowerCase() + '.js';

  // Abort if the ROOT_PATH does not exist.
  if (!fs.existsSync(root)) {
    throw new Error([
      'The root directory does not exist. Please make sure you have set',
      'the "ROOT_PATH" environmental variable.'
    ].join(' '));
  }

  // Setup environment-specific settings.
  // For example, if you are adding a custom logger to Dev, but you don't want
  // to use it in Prod, then you can create a `dev` file for dev-specific
  // settings.
  if (fs.existsSync(conf) && fs.lstatSync(conf).isFile()) {
    require(conf)(app, express);
  }

  // Load application-specific config files (routes, etc) from the `app/config`
  // directory. Any overrides, or custom settings/middleware should come from
  // here.
  var confs = fs.readdirSync(root + 'config');
  confs.forEach(function(conf) {
    var path = root + 'config/' + conf;
    if (fs.lstatSync(path).isFile() &&
        !Bula.SKIPPED_CONFIGURATION_FILES_RE_.test(path)) {
      require(path)(app);
    }
  });

  // Always load the Routes last.
  require(root + 'config/routes.js')(app);

  /**
   * Adds a reference to the main express app to the Bula contructor.
   * @type {function(Object, Object, Function)}
   * @private
   */
  this.app_ = app;
}


/**
 * Verifies that all core components are available and working.
 * @return {boolean} Whether this application has met all requirements.
 */
Bula.prototype.sanityCheck = function() {
  var app = this.app_,
      tests = {
        globals: false,
        mysql: false,
        redis: false
      };

  // Test Globals and Environmental Vars.
  // TODO: This DOES NOT test cases where there are CUSTOM properties.
  var globals = require('./core/globals.json').properties;
  if (globals && globals.length) {
    tests.globals = globals.every(function(global) {
      return app.get(global.name);
    });
  } else {
    tests.globals = false;
  }

  // Test MySQL Connection.
  tests.mysql = app.db && app.db.config;

  // Test Redis connection.
  // TODO: Write this check.
  tests.redis = true;

  // Return early if all tests passed.
  if (tests.globals && tests.mysql && tests.redis) return true;

  // If there were any failures, report them to the user.
  for (var t in tests) {
    if (!tests[t]) {
      console.log('Test Failed:\tCould not initialize ' + t + '.\n');
    }
  }

  throw new Error('Could not initialize all required dependencies.');
};


/**
 * Regular expression pattern to match against files that should be skipped in
 * in the autoload, and handled separately.
 * @const
 * @private
 * @type {!RegExp}
 */
Bula.SKIPPED_CONFIGURATION_FILES_RE_ = /^.*(json|conf|txt|routes.js)$/i;
