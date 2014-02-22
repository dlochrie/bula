/**
 * Base model class. Provides common methods for models.
 */
module.exports = Base;



/**
 * Base model constructor.
 * @constructor
 */
function Base() {}


Base.DEFAULT_WHERE_VALUE_ = '1 = 1';


/**
 * Finds all records that match the given parameters.
 * @param {Object} params The parameters on which to locate the records.
 * @param {Function} cb Callback function to fire when done.
 */
Base.prototype.find = function(params, cb) {
  var query = this.getQuery('find');
  var columns = this.getColumns();
  var where = this.buildResource(params) || Base.DEFAULT_WHERE_VALUE_;
  this.select(query, columns, where, function(err, results) {
    cb(err, results || []);
  });
};


/**
 * Finds one record that matches the given parameters.
 * @param {Object} params The parameters on which to locate the records.
 * @param {Function} cb Callback function to fire when done.
 */
Base.prototype.findOne = function(params, cb) {
  var query = this.getQuery('findOne');
  var columns = this.getColumns();
  var where = this.buildResource(params) || Base.DEFAULT_WHERE_VALUE_;
  this.select(query, columns, where, function(err, results) {
    cb(err, results ? results[0] : null);
  });
};


/**
 * Inserts a record with the given parameters.
 * @param {Object} params The parameters on which to insert.
 * @param {Function} cb Callback function to fire when done.
 */
Base.prototype.insert = function(params, cb) {
  var query = this.getQuery('insert');

  /**
   * TODO: This is ugly - think of a more elegant way:
   * (1) Prepare..?
   * (2) Validate..?
   * (3) Build..?
   */
  var resource = this.prepare(params);
  resource = this.validate(resource);

  if (!resource.isValid) {
    cb(resource.errors, null);
  } else {
    resource = this.buildResource(params);
    this.db.getConnection(function(err, connection) {
      var q = connection.query(query, resource, function(err, result) {
        connection.release(); // Return this connection to the pool.
        if (err) {
          cb('This ' + getTable() + ' could not be added: ' + err, null);
        } else {
          /**
           * During an insert the resource MUST be returned manually since the
           * Node-MySQL module does not return the inserted resource.
           */
          cb(err, resource);
        }
      });
      Base.logQuery(q);
    });
  }
};


/**
 * @param {Object} identifier The WHERE clause argument.
 * @param {Object} params The values to update.
 * @param {Function} cb Callback function to fire when done.
 */
Base.prototype.update = function(identifier, params, cb) {
  var query = this.getQuery('update');
  var resource = this.buildResource(params);
  this.db.getConnection(function(err, connection) {
    var q = connection.query(query, [resource, identifier],
        function(err, result) {
          connection.release(); // Return this connection to the pool.
          if (err) {
            // TODO: Handle sticky forms in case of failed update - eg Return resource.
            cb('This ' + getTable() + ' could not be updated: ' + err);
          } else {
            cb(err);
          }
        });
    Base.logQuery(q);
  });
};


Base.prototype.save = function() {
  throw 'Please supply a database adapter.';
};


/**
 * Removes the resource identified by the parameters.
 * @param {Object} params Object identifying resource to remove.
 */
Base.prototype.remove = function(params, cb) {
  var self = this;
  var query = this.getQuery('remove');
  var resource = this.buildResource(params);
  this.db.getConnection(function(err, connection) {
    var q = connection.query(query, resource, function(err) {
      connection.release(); // Return this connection to the pool.
      if (err) {
        cb('This ' + self.getTable() + ' could not be deleted: ' + err, null);
      } else {
        cb(err);
      }
    });
    Base.logQuery(q);
  });
};


/**
 * Validates the resource against the model's STRUCTURE.
 */
Base.prototype.validate = function(resource) {
  var structure = this.getStructure();
  var errors = [];

  for (property in structure) {
    var rules = structure[property];

    // Validate Required Properties...
    if (rules['required'] && !resource[property]) {
      errors.push('The following required field is missing: ' +
          property);
    }

    // TODO: Validate Length (MIN and MAX)

    // TODO: Validate Types... (String, Number, Date, etc)...
  }

  var isValid = !errors.length ? true : false;
  return {isValid: isValid, errors: errors};
};


/**
 * Wrapper for SELECT statements.
 * Performs query and returns connection back to pool.
 * @param {string} query The query string to append values to.
 * @param {Object} columns The columns to retrieve in the query.
 * @param {Object} where The parameters that identify the result set.
 * @param {Functon(<string>, <Array>)} Callback function to perform when done.
 */
Base.prototype.select = function(query, columns, where, cb) {
  /**
   * Nesting tables allows for results like:
   * {
   *   post: {id: '...', title: '...'},
   *   user: {id: '...', displayName: '...'}
   * }
   */
  var options = {
    sql: query,
    nestTables: true
  };
  this.db.getConnection(function(err, connection) {
    var q = connection.query(options, [columns, where], function(err, results) {
      connection.release();
      cb(err, results || []);
    });
    Base.logQuery(q);
  });
};


/**
 * Builds the resource as an Object with Field:Value pairs.
 * @param {Object} params Resource to parse for key-value pairs.
 * @return {Object} The formatted resource.
 */
Base.prototype.buildResource = function(params) {
  var structure = this.getStructure();
  var table = this.getTable();
  var keys = Object.keys(params) || [];
  if (!params || !keys.length) return null;
  var resource = {};
  keys.forEach(function(key) {
    if (structure[key]) {
      resource[table + '.' + key] = params[key];
    }
  });
  return resource;
};


/**
 * Logs the assembled and escaped query after it has run.
 * @param {Object} query Node-Mysql query result.
 */
Base.logQuery = function(query) {
  query = query || {};
  console.log('MySQL Query:\t', query.sql || 'N/A');
};
