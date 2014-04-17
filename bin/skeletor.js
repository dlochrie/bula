/**
 * Get all arguments.
 */
var argv = require('optimist')
    .usage(
        'Installs a Skeletor Application to the specified directory.' +
        '\nUsage: $0')
    .demand('a')
    .alias('a', 'appName')
    .describe('a', 'Sets the name application.')
    .demand('p')
    .alias('p', 'path')
    .describe('a', 'Sets the path to install to.')
    .argv;



/**
 * Main function for the installer script.
 * @constructor
 */
function Install() {
  /**
   * @private
   */
  this.path_ = argv.path;

  /**
   * @private
   */
  this.app_ = argv.appName;

  // Initialize the installation.
  this.findOrCreatePath_();
}


/**
 * @const {Object.<string, Array>}
 * @private
 */
Install.STRUCTURE_ = {
  app: [
    'controllers',
    'helpers',
    'models',
    'views'
  ],
  config: [
    'environment'
  ],
  public: [
    'css',
    'images',
    'js'
  ]
};


/**
 * Looks up a path and creates it if it does not exist.
 * @private
 */
Install.prototype.findOrCreatePath_ = function() {
  if (fs.lstatSync(this.path_).isDirectory()) {
    this.deployAllFiles_();
  } else {
    // First, try to create the path, then...
    // ...complain that this is NOT a directory, or it cannot be found.
  }
};


/**
 * Copies all files over to the new directory.
 * @private
 */
Install.prototype.deployAllFiles_ = function() {
  // Start with the root files.
  // Next load the rest of the structure - overwrite as necessary.
};


/**
 * Expose the `Install` Constructor.
 */
module.exports = new Install();
