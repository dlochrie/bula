var fs = require('fs');


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

  this.initialize_();
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
 * Kicks off the install process.
 * @private
 */
Install.prototype.initialize_ = function() {
  var dir = this.path_ + this.app_.toLowerCase();
  var self = this;
  // Create the application directory.
  this.findOrCreatePath_(dir, function(err) {
    if (err) throw ('Could not create the directory:\t' + dir);
    // Start deploying the new files to the application.
    self.deployAllFiles_();
  });
};


/**
 * Looks up a path and creates it if it does not exist.
 * @param dir {string}
 * @private
 */
Install.prototype.findOrCreatePath_ = function(dir, done) {
  var self = this;
  fs.lstat(dir, function(err, stat) {
    if (err) {
      fs.mkdir(dir, function(err) {
        if (err) {
          done(err);
        } else {
          self.findOrCreatePath_(dir, done);
        }
      });
    } else {
      done();
    }
  });
};


/**
 * Copies all files over to the new directory.
 * @private
 */
Install.prototype.deployAllFiles_ = function() {
  console.log('Creating all files.');
  // Start with the root files.
  // Next load the rest of the structure - overwrite as necessary.
};


/**
 * Expose the `Install` Constructor.
 */
module.exports = new Install();
