var fs = require('fs'),
    path = require('path');


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
   * Name of application - will be used through the install process, and also
   * indicates the name of the directory in which this application will be
   * installed.
   * @type {string}
   * @private
   */
  this.appName_ = argv.appName;

  /**
   * Root path to install to - does not include the app name.
   * TODO: Right now only Unix-style slashes are being used.
   * @private
   */
  this.appPath_ = Install.addSlash(argv.path);

  /**
   * Default options for reading files. Reading as a utf-8-encoded string, as
   * opposed to raw binary, allows us to replace placeholders in the text.
   * @private
   */
  this.readOptions_ = {encoding: 'utf8'};

  /**
   * Object containing a mapping of directories and files to deploy.
   * @type {Object.<string, Array>}
   * @private
   */
  this.manifest_ = {
    directories_: [],
    files_: []
  };

  /**
   * The source directory for all deployable files and directories.
   * @type {string}
   * @private
   */
  this.skeletorDir_ = path.resolve(__dirname, '../install');

  // Start the install process.
  this.initialize_();
}


/**
 * TODO:
 * This should crawl the directory recursively, and create the directories where
 * they need to be created, and copy files where they need to be created.
 * A manifest/install log should be created as well, and deployed to the
 * new application's root directory.
 * @private
 */
Install.prototype.buildFileManifest_ = function() {
  var self = this;

  var walk = function(dir, done) {
    fs.readdir(dir, function(err, list) {
      if (err) return self.complain_(err);
      var pending = list.length;
      if (!pending) return done(null);
      list.forEach(function(entity) {
        entity = dir + '/' + entity;
        fs.stat(entity, function(err, stat) {
          if (err) return self.complain_(err);
          if (stat && stat.isDirectory()) {
            var installPath = self.normalizePath_(entity);
            walk(entity, function(err) {
              if (err) return self.complain_(err);
              self.manifest_.directories_.push(installPath);
              if (!--pending) done(null);
            });
          } else {
            var installPath = self.normalizePath_(entity);
            self.manifest_.files_.push({
              original: entity,
              install: installPath
            });
            if (!--pending) done(null);
          }
        });
      });
    });
  };

  /**
   * Populate the manifest.
   * TODO: Fix so that the callback don't get too deep.
   */
  walk(this.skeletorDir_, function(err) {
    if (err) return self.complain_(err);
    self.deployAllDirectories_(function(err) {
      if (err) return self.complain_(err);
      console.log('Done installing directories.');
      self.deployAllFiles_(function(err) {
        if (err) return self.complain_(err);
        console.log('Done installing files.');
      });
    });
  });
};


/**
 * Throws an error an aborts the process with an error message.
 * @param {string} text The error message.
 * @private
 */
Install.prototype.complain_ = function(text) {
  throw new Error('\n\t' + text + '\n\nStack Trace:\n');
};


/**
 * Copies a file to a new location based on provided target destination.
 * 1. Reads the file as a utf8-encoded string.
 * 2. Replaces the {{ appName }} in the string/file data.
 * 3. Writes the file to the new location.
 * @param {Object.<string, string>} file The file object.
 * @param {Function(string)} done Callback function to call when operation has
 *     finished, or aborted.
 * @private
 */
Install.prototype.copyFile_ = function(file, done) {
  var options = this.readOptions_,
      self = this;
  fs.readFile(file.original, options, function(err, data) {
    if (err) return done(err);
    data = data.replace(Install.appNameRegex_, self.appName_);
    fs.writeFile(file.install, data, done(err));
  });
};


/**
 * Creates new directories based on the provided directory structure.
 * @param {Function(string)} done Callback function to call when operation has
 *      finished, or aborted.
 * @private
 */
Install.prototype.deployAllDirectories_ = function(done) {
  var self = this,
      directories = this.manifest_.directories_.sort();

  function createDir(dir) {
    if (!dir) return done(null);
    self.findOrCreateDirectory_(dir, function(err) {
      if (err) throw ('Could not create the directory:\t', dir, err);
      createDir(directories.shift());
    });
  }

  createDir(directories.shift());
};


/**
 * Deploys all files, replacing the application name token with the provided
 * "appName" argument.
 * @param {Function(string)} done Callback function to call when operation has
 *     finished, or aborted.
 * @private
 */
Install.prototype.deployAllFiles_ = function(done) {
  var self = this,
      files = this.manifest_.files_.sort();

  // Recursively copies each file in the files array until all files are done.
  function installFile(file) {
    if (!file) return done(null);
    self.copyFile_(file, function(err) {
      if (err) throw err;
      installFile(files.shift());
    });
  }

  installFile(files.shift());
};


/**
 * Looks up a path and creates it if it does not exist.
 * @param {string} dir The directory to create.
 * @param {Function(string)} done Callback function to call when operation has
 *     finished, or aborted.
 * @private
 */
Install.prototype.findOrCreateDirectory_ = function(dir, done) {
  var self = this;
  fs.lstat(dir, function(err, stat) {
    if (stat && stat.isDirectory()) return done();
    fs.mkdir(dir, function(err) {
      if (err) return done(err);
      return self.findOrCreateDirectory_(dir, done);
    });
  });
};


/**
 * Normalized name of the application install directory - will serve as the
 * "root path" for this app.
 * @private
 * @return {string} Full root path for application.
 */
Install.prototype.getRootPath_ = function() {
  return this.appPath_ + Install.addSlash(this.appName_).toLowerCase();
};


/**
 * Kicks off the install process.
 * @private
 */
Install.prototype.initialize_ = function() {
  var self = this,
      dir = this.getRootPath_();

  this.findOrCreateDirectory_(dir, function(err) {
    if (err) throw ('Could not create the directory:\t' + dir);
    self.buildFileManifest_();
  });
};


/**
 * Normalizes a path by stripping extra slashes and the base skeletor
 * directory, and by prepending the target application install directory.
 * @param {string} target The path of the file or directory to normalize.
 * @private
 * @return {string} Normalized path for directory or file.
 */
Install.prototype.normalizePath_ = function(target) {
  var rootPath = this.getRootPath_();
  return path.normalize(rootPath + target.replace(this.skeletorDir_, ''));
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
 * Pattern to match when looking for appName replacements.
 * @const
 * @type {RegExp}
 * @private
 */
Install.appNameRegex_ = /{+\s*appName\s*}+/;


/**
 * Expose the `Install` Constructor.
 */
module.exports = new Install();
