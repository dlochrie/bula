var util = require('util');


/**
 * Base model class. Provides common methods for models.
 */
module.exports = Base;



/**
 * Base model constructor.
 * @constructor
 */
function Base() {}


/**
 * Default 'where' value for SELECT statements.
 * @const
 * @private {string}
 */
Base.DEFAULT_WHERE_VALUE_ = '1 = 1';


/**
 * Error message indicating that there is no query defined in the model.
 * @const
 * @private {string}
 */
Base.DEFAULT_MISSING_QUERY_MESSAGE_ =
    'Could not find a query for this action: ';


/**
 * Finds all records that match the given parameters.
 * @param {Function} cb Callback function to fire when done.
 * @return {Function(string, Array)} Callback function.
 */
Base.prototype.find = function(cb) {
  var query = this.getQuery('find');
  if (!query) {
    return cb(Base.DEFAULT_MISSING_QUERY_MESSAGE_ + 'find.', null);
  }
  var columns = this.getColumns();
  var where = this.getQueryObject() || Base.DEFAULT_WHERE_VALUE_;
  this.select(query, columns, where, function(err, results) {
    return cb(err, results || []);
  });
};


/**
 * Finds one record that matches the given parameters.
 * @param {Function} cb Callback function to fire when done.
 * @return {Function(string, Object)} Callback function.
 */
Base.prototype.findOne = function(cb) {
  var query = this.getQuery('findOne');
  if (!query) {
    return cb(Base.DEFAULT_MISSING_QUERY_MESSAGE_ + 'findOne.', null);
  }
  var columns = this.getColumns();
  var where = this.getQueryObject(this.resource) || Base.DEFAULT_WHERE_VALUE_;
  this.select(query, columns, where, function(err, results) {
    return cb(err, results ? results[0] : null);
  });
};


/**
 * Checks to see if a record exists, and attempts to create one if it does not.
 * The initial resource (used for `find` query) should be initialized before
 * invoking this method, and the supplied resource should be passed as the first
 * param.
 * @param {Object} resource The resource/record to create if one does not exist.
 * @param {Function(string, Object)} cb Callback function to fire when done.
 */
Base.prototype.findOrCreate = function(resource, cb) {
  this.findOne(function(err, result) {
    if (err || result) {
      cb(err, result);
    } else {
      this.resource = resource;
      this.insert(function(err, result) {
        err = err ? util.format(
            'There was an error creating the %s: %s',
            this.getTable() || 'record', err) : false;
        result = result || null;
        cb(err, result);
      });
    }
  }.bind(this));
};


/**
 * Inserts a record with the given parameters.
 * @param {Function} cb Callback function to fire when done.
 * @return {Function(string, Array)} Callback function.
 */
Base.prototype.insert = function(cb) {
  var self = this;
  var query = this.getQuery('insert');
  if (!query) {
    return cb(Base.DEFAULT_MISSING_QUERY_MESSAGE_ + 'insert.', null);
  }

  this.validate(function(err) {
    if (err && err.length) return cb(err, null);

    // Prepare the resource, adding any system generated values, like slug's,
    // and then format it for inserting in DB.
    var resource = self.prepare();
    var insertObject = self.getQueryObject(resource) || {};

    this.db.getConnection(function(err, connection) {
      if (err) return cb(err, null);
      var q = connection.query(query, insertObject, function(err, result) {
        connection.release(); // Return this connection to the pool.
        if (err) {
          err = util.format('This %s could not be added: %s',
              self.getTable(), err);
          cb(err, null);
        } else {
          // During an insert the resource MUST be returned manually since the
          // node-mysql module does not return the inserted resource.
          cb(err, resource);
        }
      });
      self.logQuery_(q);
    });
  });
};


/**
 * @param {Object} identifier The WHERE clause argument.
 * @param {Function} cb Callback function to fire when done.
 * @return {Function(string, Array)} Callback function.
 */
Base.prototype.update = function(identifier, cb) {
  var self = this;
  var query = this.getQuery('update');
  if (!query) {
    return cb(Base.DEFAULT_MISSING_QUERY_MESSAGE_ + ' update.', null);
  }

  this.validate(function(err) {
    if (err) return cb(err, null);

    // Prepare the resource, adding any system generated values, like slug's.
    // The format it for inserting in DB.
    var resource = self.prepare();
    var insertObject = self.getQueryObject(resource) || {};

    this.db.getConnection(function(err, connection) {
      if (err) return cb(err, null);

      var q = connection.query(
          query, [insertObject, identifier], function(err, result) {
            connection.release(); // Return this connection to the pool.
            if (err) {
              cb('This ' + self.getTable() + ' could not be updated: ' +
                 err, null);
            } else {
              cb(err, resource);
            }
          });
      self.logQuery_(q);
    });
  });
};


/**
 * Removes the resource identified by the parameters.
 * @param {Functon(<string>, <Array>)} cb Callback function to perform when
 *     done.
 */
Base.prototype.remove = function(cb) {
  var self = this;
  this.db.getConnection(function(err, connection) {
    if (err) return cb(err, null);
    var query = self.getQuery('remove');
    if (!query) {
      return cb(Base.DEFAULT_MISSING_QUERY_MESSAGE_ + ' remove.', null);
    }
    var where = self.getQueryObject(self.resource);
    var q = connection.query(query, where, function(err) {
      if (err) return cb(err, null);
      connection.release(); // Return this connection to the pool.
      if (err) {
        cb('This ' + self.getTable() + ' could not be deleted: ' + err, null);
      } else {
        cb(err);
      }
    });
    self.logQuery_(q);
  });
};


/**
 * Wrapper for SELECT statements.
 * Performs query and returns connection back to pool.
 * @param {string} query The query string to append values to.
 * @param {Object} columns The columns to retrieve in the query.
 * @param {Object} where The parameters that identify the result set.
 * @param {Functon(<string>, <Array>)} cb Callback function to perform when
 *     done.
 */
Base.prototype.select = function(query, columns, where, cb) {
  var self = this;
  this.db.getConnection(function(err, connection) {
    if (err) return cb(err, null);
    // Nesting tables allows for results like:
    //   {
    //     post: {id: '...', title: '...'},
    //     user: {id: '...', displayName: '...'}
    //   }
    var options = {sql: query, nestTables: true};
    var q = connection.query(options, [columns, where], function(err, results) {
      if (err) return cb(err, null);
      connection.release();
      cb(err, results || []);
    });
    self.logQuery_(q);
  });
};


/**
 * Validates the resource against the model's STRUCTURE.
 * @param {Functon(<Array>)} cb Callback function to perform when done.
 */
Base.prototype.validate = function(cb) {
  var resource = this.resource;
  var structure = this.getStructure();
  var errors = [];

  if (structure) {
    for (var property in structure) {
      var rules = structure[property];

      // Validate required properties.
      if (rules['required'] && !resource[property]) {
        errors.push('The following required field is missing: ' + property);
      }

      // TODO: Validate Length (MIN and MAX)
      // TODO: Validate Types... (String, Number, Date, etc)...
    }
  }

  cb(errors.length ? errors : []);
};


/**
 * Converts the model resource into a query object with key:value pairs.
 * @return {?Object || null} The formatted resource.
 */
Base.prototype.getQueryObject = function() {
  if (!this.resource || !Object.keys(this.resource).length) {
    return null;
  }

  var structure = this.getStructure();
  var tableName = this.getTable();
  var resource = this.resource;
  var object = {};

  var fields = Object.keys(structure) || [];
  fields.forEach(function(field) {
    if (resource[field]) {
      object[tableName + '.' + field] = resource[field];
    }
  });

  return object;
};


/**
 * Logs the assembled and escaped query after it has run.
 * Application must set `LOG QUERIES` for the logs to be displayed.
 * @param {Object} query Node-Mysql query result.
 * @private
 */
Base.prototype.logQuery_ = function(query) {
  if (this.app.get('LOG QUERIES')) {
    query = query || {};
    var message = util.format('MySQL Query:\t %s', query.sql || 'N/A');
    console.log(message);
  }
};
