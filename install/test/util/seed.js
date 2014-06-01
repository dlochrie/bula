var fs = require('fs'),
    path = require('path')
    Q = require('q');


/**
 * Expose 'Seed' module.
 */
module.exports = Seed;



/**
 * The Seed module populates fixtures for functional testing.
 * @param {express.app} app Express App instance.
 * @param {string} model The model on which to operate.
 * @param {?Array.<string>=} opt_dependencies Optional models required for this
 *     model to be tested.
 * @constructor
 */
function Seed(app, model, opt_dependencies) {
  /**
   * Instance of Node MySQL.
   * @type {Object}
   * @private
   */
  this.db_ = app.db;

  /**
   * Models/tables that this model requires for testing.
   * @type {?Array.<string>}
   * @private
   */
  this.dependencies_ = opt_dependencies || [];

  /**
   * The model on which to operate.
   * @type {string}
   * @private
   */
  this.model_ = model;

  /**
   * Default options for reading files. Reading as a utf-8-encoded string, as
   * opposed to raw binary, allows for proper sql queries.
   * @private
   */
  this.readOptions_ = {encoding: 'utf8'};

  /**
   * Path to fixtures/SQL scripts.
   * @type {string}
   * @private
   */
  this.root_ = app.get('ROOT PATH') + 'test/fixtures/';

  /**
   * Path to tables/SQL scripts.
   * @type {string}
   * @private
   */
  this.tablesDir_ = app.get('ROOT PATH') + 'examples/sql/';

  /**
   * Locally-stored mapping of fixture and mapped SQL.
   * @type {Object.<string, string>}
   * @private
   */
  // this.fixtures_ = this.getFixtures_();

  /**
   * Create the model's table if it doesn't exist.
   */
  // this.createTable();

  /**
   * Create the table's dependencies.
   */
  // this.dependencies_.forEach(function(dependency) {
  //   this.createTable(dependency);
  // }, this);
}

Seed.prototype.setup = function() {
  var queue = [],
      self = this;
  var models = [].concat(this.model_, this.dependencies_);

  // Schedule the creation and seeding of each model/table, but defer
  // execution.
  models.forEach(function(model) {
    queue.push(self.createTable_(model));
    queue.push(self.populateFixtures_(model));
  });

  console.log('Executing', queue);
  Q.allSettled(queue).done(function(queries) {
    console.log('Done Executing.')
    console.log('queries', queries);
  });

};


Seed.prototype.createTable_ = function(model) {
  var file = this.tablesDir_ + model + '.sql',
      sql = this.readSqlFromFile_(file);

  var deferred = Q.defer();
  if (sql) {
    this.db_.getConnection(function(err, connection) {
      if (err) {
        deferred.reject(new Error(
            'This table (' + model + ') could not' + 'be created: ' + err));
      } else {
        connection.query(sql, function(err, result) {
          connection.release(); // Return this connection to the pool.
          console.log('DONE CREATING');
          if (err) {
            deferred.reject(new Error(
                'This table (' + model + ') could not' + 'be created: ' + err));
          } else {
            deferred.resolve();
          }
        });
      }
    });
  }
  return deferred.promise;
};

// Returns a promise from another method.
// Should this be renamed to setup, or populate???
Seed.prototype.populateFixtures_ = function(model) {
  var files = fs.readdirSync(this.root_),
      self = this;

  return files.some(function(fixture) {
    if (self.getBaseName_(fixture) === model) {
      fixture = self.root_ + fixture;
      var data = self.readSqlFromFile_(fixture);
      if (self.isSetup_(fixture)) {
        return self.executeSQL_(data);
      }
    }
  });
};


Seed.prototype.teardown = function(model) {
  var files = fs.readdirSync(this.root_),
      self = this;

  return files.some(function(fixture) {
    if (self.getBaseName_(fixture) === model) {
      fixture = self.root_ + fixture;
      var data = self.readSqlFromFile_(fixture);
      if (!self.isSetup_(fixture)) {
        return self.executeSQL_(data);
      }
    }
  });
};


/**
 * Process the SQL Query.
 * @param {string} sql The raw SQL to process.
 * @private
 */
Seed.prototype.executeSQL_ = function(sql) {
  var deferred = Q.defer();
  this.db_.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(
        new Error('Could not perform query: ' + sql + '\n' + err));
    } else {
      connection.query(sql, function(err, result) {
        connection.release(); // Return this connection to the pool.
        if (err) {
          console.log('ERROR:\t', err);
          deferred.reject(
            new Error('Could not perform query: ' + sql + '\n' + err));
        } else {
          console.log('SUCCESS:\n\t', sql);
          deferred.resolve();
        }
      });
    }
  });
  return deferred.promise;
};


/**
 * Gets the basename for a file based on its extension.
 * @param {?string} filename Name of file to get basename for.
 * @private
 * @return {string} Basename of the file.
 */
Seed.prototype.getBaseName_ = function(filename) {
  var basename = (filename || '').replace(Seed.BASE_FILENAME_REGEX_, '');
  return path.basename(basename, '.sql').toLowerCase();
};


/**
 * Gets the fixtures based on model. Reads and stores the sql for both setup and
 * teardown.
 * @param {string=} opt_model The model to get fixtures for.
 * @private
 * @return {Object.<string, string>}
 */
// Seed.prototype.getFixtures_ = function(model) {
//   var files = fs.readdirSync(this.root_),
//       model = opt_model || this.model_,
//       self = this;

//   var fixtures = {};
//   files.forEach(function(fixture) {
//     if (self.getBaseName_(fixture) === model) {
//       fixture = self.root_ + fixture;
//       var data = self.readSqlFromFile_(fixture);
//       if (self.isSetup_(fixture)) {
//         fixtures.setup_ = data;
//       } else {
//         fixtures.teardown_ = data;
//       }
//     }
//   });
//   return fixtures;
// };


/**
 * Determines whether the script is a setup or teardown SQL script, based on
 * filename extension.
 * @param {?string} filename Name of file to test.
 * @private
 * @return {boolean} Whether the script is a setup or teardown script.
 */
Seed.prototype.isSetup_ = function(filename) {
  return (filename || '').toLowerCase().match(Seed.SETUP_FILE_REGEX_);
};


/**
 * Gets the raw SQL from the script by reading it as a UTF-8-encoded string.
 * @param {string} file Full path to the file to read.
 * @private
 * @return {string} The raw SQL data.
 */
Seed.prototype.readSqlFromFile_ = function(file) {
  return fs.lstatSync(file).isFile() ?
      fs.readFileSync(file, this.readOptions_) : null;
};


/**
 * Creates a table given the optional model, or the model that that was
 * initialized in the init method.
 * @param {?string=} opt_model The optional model's name.
 */
// Seed.prototype.createTable = function(opt_model) {
//   var model = opt_model || this.model_;
//   var file = this.tablesDir_ + model + '.sql',
//       sql = this.readSqlFromFile_(file);

//   if (sql) {
//     this.db_.getConnection(function(err, connection) {
//       if (err) throw new Error(
//           'This table (' + model + ') could not' + 'be created: ' + err);
//       connection.query(sql, function(err, result) {
//         connection.release(); // Return this connection to the pool.
//         if (err) {
//           throw new Error(
//               'This table (' + model + ') could not be created: ' + err);
//         }
//       });
//     });
//   }
// };


/**
 * Perform the `setup` operation - usually creating and populating a table after
 * truncating it first.
 */
// Seed.prototype.setup = function() {
//   this.teardown_();
//   if (this.fixtures_ && this.fixtures_.setup_) {
//     this.createTable();
//     this.executeSQL_(this.fixtures_.setup_);
//   }

//   // Populate fixtures for dependencies.
//   this.dependencies_.forEach(function(dependency) {
//     this.createTable(dependency);
//     var sql = this.getFixtures_(dependency).setup_;
//     this.executeSQL_(sql);
//   }, this);
// };


/**
 * Perform the `teardown` operation - usually deleting a table.
//  */
// Seed.prototype.teardown_ = function() {
//   if (this.fixtures_ && this.fixtures_.teardown_) {
//     this.executeSQL_(this.fixtures_.teardown_);
//   }

//   // Delete tables for dependencies.
//   this.dependencies_.forEach(function(dependency) {
//     var sql = this.getFixtures_(dependency).teardown_;
//     this.executeSQL_(sql);
//   }, this);
// };


/**
 * Base name of file, less the `setup` or `teardown` suffix.
 * @const
 * @type {RegExp}
 * @private
 */
Seed.BASE_FILENAME_REGEX_ = /_+[a-zA-Z]+/;


/**
 * Regex to determine whether a SQL script is for setup or teardown.
 * @const
 * @type {RegExp}
 * @private
 */
Seed.SETUP_FILE_REGEX_ = /_setup/;
