var Base = require('./base');

// Expose `User` Model
module.exports = User;



/**
 * User model constructor.
 * @param {express.app} app Express App instance.
 * @param {Object=} resource Optional resource.
 * @constructor
 * @implements {app.models.base}
 */
function User(app, resource) {
  this.app = app;
  this.resource = resource || null;
  this.db = app.db.connection;
  Base.call(this);
}
require('util').inherits(User, Base);


/**
 * Collection name.
 * @const
 * @type {string}
 */
User.COLLECTION_ = 'user';


/**
 * Finds all records that match the given parameters.
 * @param {Object} params The parameters on which to locate the records.
 * @param {Function} cb Callback function to fire when done.
 */
User.prototype.find = function(params, cb) {
  this.db.collection(User.COLLECTION_).
      findOne(params, function(err, user) {
        cb(err, user);
      });
};


/**
 * Finds one record that matches the given parameters.
 * @param {Object} params The parameters on which to locate the records.
 * @param {Function} cb Callback function to fire when done.
 */
User.prototype.findOne = function(params, cb) {
  this.db.collection(User.COLLECTION_).
      findOne(params, function(err, user) {
        cb(err, user);
      });
};
