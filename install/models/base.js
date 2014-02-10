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
 * Finds all records that match the given parameters.
 * @param {Object} params The parameters on which to locate the records.
 * @param {Function} cb Callback function to fire when done.
 */
Base.prototype.find = function(params, cb) {
  var query = this.QUERIES_['find'];
  var resource = this.buildResource(params);
  this.db.getConnection(function(err, connection) {
    connection.query(query, resource || '1 = 1', function(err, results) {
      connection.release(); // Return this connection to the pool.
      var results = results || [];
      cb(err, results);
    });
  });
};


/**
 * Finds one record that matches the given parameters.
 * @param {Object} params The parameters on which to locate the records.
 * @param {Function} cb Callback function to fire when done.
 */
Base.prototype.findOne = function(params, cb) {
  var query = this.QUERIES_['findOne'];
  var resource = this.buildResource(params);
  this.db.getConnection(function(err, connection) {
    connection.query(query, resource || '1 = 1', function(err, results) {
      connection.release(); // Return this connection to the pool.
      var result = results[0] || null;
      cb(err, result);
    });
  });
};


/**
 * Inserts a record with the given parameters.
 * @param {Object} params The parameters on which to insert.
 * @param {Function} cb Callback function to fire when done.
 */
Base.prototype.insert = function(params, cb) {
  var query = this.queries['insert'];
  var resource = this.buildResource(params);
  this.db.getConnection(function(err, connection) {
    connection.query(query, resource, function(err, result) {
      connection.release(); // Return this connection to the pool.
      if (err) {
        cb('This ' + this.TABLE_ + ' could not be added: ' + err, null);
      } else {
        /**
         * During an insert the resource MUST be returned manually since the
         * Node-MySQL module does not return the inserted resource.
         */
        cb(err, resource);
      }
    });
  });
};


Base.prototype.update = function() {
  throw 'Please supply a database adapter.';
};


Base.prototype.save = function() {
  throw 'Please supply a database adapter.';
};


Base.prototype.remove = function() {
  throw 'Please supply a database adapter.';
};


Base.prototype.validate = function() {
  throw 'Please supply a database adapter.';
};


/**
 * Builds the resource as Object with Field:Value pairs.
 * @param {Object} params Resource to parse for key-value pairs.
 * @return {Object} The formatted resource.
 */
Base.prototype.buildResource = function(params) {
  var structure = this.STRUCTURE_;
  var keys = Object.keys(params) || [];
  if (!params || !keys.length) return null;
  var resource = {};
  keys.forEach(function(key) {
    if (structure[key]) {
      resource[key] = params[key];
    }
  });
  return resource;
};
