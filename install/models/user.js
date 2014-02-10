var Base = require('./base');

/**
 * Expose `User` Model
 */
module.exports = User;



/**
 * User model constructor.
 * @param {express.app} app Express App instance.
 * @param {Object=} resource Optional resource.
 * @constructor
 * @extends {app.models.base}
 */
function User(app, resource) {
  this.app = app;
  this.resource = resource || null;
  this.db = app.db;

  /**
   * Table name.
   * @const
   * @private {string}
   */
  this.TABLE_ = 'user';

  /**
   * Table strucure.
   * @private
   * @enum {string}
   */
  this.STRUCTURE_ = {
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
   * MySQL Query Strings.
   * @private
   * @enum {string}
   */
  this.QUERIES_ = {
    find: 'SELECT * FROM `' + this.TABLE_ + '` WHERE ?',
    findOne: 'SELECT * FROM `' + this.TABLE_ + '` WHERE ? LIMIT 1',
    insert: 'INSERT INTO `' + this.TABLE_ + '` SET ?'
  };

  Base.call(this);
}
require('util').inherits(User, Base);