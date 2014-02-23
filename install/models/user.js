var Base = require('./base');


/**
 * Expose `User` Model
 */
module.exports = User;



/**
 * User model constructor.
 * @param {express.app} app Express App instance.
 * @param {Object=} opt_resource Optional resource.
 * @constructor
 * @extends {app.models.base}
 */
function User(app, opt_resource) {
  this.app = app;
  this.resource = opt_resource || null;
  this.db = app.db;
  Base.call(this);
}
require('util').inherits(User, Base);


/**
 * Table name.
 * @const
 * @private {string}
 */
User.TABLE_ = 'user';


/**
 * Columns to retrieve in SELECT statements.
 * @const
 * @private {Array.<string>}
 */
User.SELECT_COLUMNS_ = ['id', 'displayName', 'slug', 'email', 'created',
  'updated'];


/**
 * MySQL Query Strings.
 * @private
 * @enum {string}
 */
User.QUERIES_ = {
  find: 'SELECT ?? FROM `' + User.TABLE_ + '` WHERE ?',
  findOne: 'SELECT ?? FROM `' + User.TABLE_ + '` WHERE ? LIMIT 1',
  insert: 'INSERT INTO `' + User.TABLE_ + '` SET ?'
};


/**
 * Table strucure.
 * @private
 * @enum {string}
 */
User.STRUCTURE_ = {
  id: {type: Number, required: false},
  displayName: {type: String, length: 100, required: true},
  slug: {type: String, length: 100, required: true},
  email: {type: String, length: 100, required: true},
  google_id: {type: String, length: 100, required: false},
  facebook_id: {type: Number, length: 100, required: false},
  twitter: {type: String, length: 100, required: false},
  created: {type: Number, required: true, default: 'NOW()'},
  updated: {type: Number, required: true, default: 'NOW()'}
};


/**
 * Gets the named query, or returns them all.
 * @param {?string} action Type of query to get/perform.
 * @return {string|Object} query or queries.
 */
User.prototype.getQuery = function(action) {
  if (action) {
    return User.QUERIES_[action];
  } else {
    return User.QUERIES_;
  }
};


/**
 * Gets the columns to be displayed in a result, or returns them all.
 * @param {?string} action Type of query to get/perform.
 * @return {string|Object} query or queries.
 */
User.prototype.getColumns = function(action) {
  return User.SELECT_COLUMNS_;
};


/**
 * Gets the current model's structure.
 * @return {Object} structure object.
 */
User.prototype.getStructure = function() {
  return User.STRUCTURE_;
};


/**
 * Gets the table name for the current model.
 * @return {string} table name.
 */
User.prototype.getTable = function() {
  return User.TABLE_;
};
