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
   * Root path to install to - does not include the app name.
   * TODO: Right now only Unix-style slashes are being used.
   * @private
   */
  this.path_ = Install.addSlash(argv.path);

  /**
   * Name of application - will be used through the install process, and also
   * indicated the name of the directory in which this application will be
   * installed.
   * @private
   */
  this.app_ = argv.appName;

  /**
   * Normalized name of the application install directory - will serve as the
   * "root path" for this app.
   * @private
   */
  this.appDirectory_ = this.path_ + Install.addSlash(this.app_).toLowerCase();

  // Start the install process.
  this.initialize_();
}


/**
 * @const {Object.<string, Array>}
 * @private
 */
Install.STRUCTURE_ = [
  {
    'name': 'app',
    'children': [{
      'name': 'controllers',
      'path': 'controllers',
      'children': [{
        'name': 'admin'
      }]
    }, {
      'name': 'helpers'
    }, {
      'name': 'models'
    }, {
      'name': 'views'
    }]
  }, {
    'name': 'config',
    'children': [{
      'name': 'environment'
    }]
  }, {
    'name': 'public',
    'children': [{
      'name': 'css'
    }, {
      'name': 'images'
    }, {
      'name': 'js'
    }]
  }];


/**
 * Kicks off the install process.
 * @private
 */
Install.prototype.initialize_ = function() {
  var dir = this.appDirectory_;
  var self = this;
  // Create the application directory.
  this.findOrCreateDirectory_(dir, function(err) {
    if (err) throw ('Could not create the directory:\t' + dir);
    // Start deploying the new files to the application.
    self.deployAllDirectories_();
  });
};


/**
 * Looks up a path and creates it if it does not exist.
 * @param dir {string}
 * @private
 */
Install.prototype.findOrCreateDirectory_ = function(dir, done) {
  var self = this;
  fs.lstat(dir, function(err, stat) {
    if (err || (stat && !stat.isDirectory())) {
      fs.mkdir(dir, function(err) {
        if (err) {
          done(err);
        } else {
          self.findOrCreateDirectory_(dir, done);
        }
      });
    } else {
      done();
    }
  });
};


/**
 * Creates new directories based on the provided directory structure.
 * @private
 */
Install.prototype.deployAllDirectories_ = function() {
  var structure = Install.STRUCTURE_;
  var self = this;

  function installDirectory(dir, opt_parent) {
    var name = dir.name;
    var path = opt_parent ? opt_parent + name : self.appDirectory_ + name;
    console.log('Attempting to create directory:\t', path);
    self.findOrCreateDirectory_(path, function(err) {
      if (err || !fs.lstatSync(path).isDirectory()) {
        throw ('Could not create the directory:\t' + path);
      }
      console.log('Successfully created:\t' + path);
      console.log('Attempting to deploy files for:\t' + name);
      if (dir.children) {
        dir.children.forEach(function(child) {
          installDirectory(child, Install.addSlash(path));
        });
      }
    });
  }

  for (struct in structure) {
    installDirectory(structure[struct]);
  }
};


/**
 * Adds a slash to the end of the string if one does not exist.
 * @param {*} str String to append slash to.
 * @return {string} String with slash at the end of it.
 */
Install.addSlash = function(str) {
  return (str ? str.toString() : '').replace(/\/?$/, '/');
};


/**
 * Expose the `Install` Constructor.
 */
module.exports = new Install();
