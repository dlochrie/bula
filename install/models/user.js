var Base = require('./base');

// Expose `User` Model
module.exports = User;



/**
 * User model constructor.
 * @param {express.app} app Express App instance.
 * @param {Object=} resource Optional resource.
 * @constructor
 * @implements {app.models.base} // TODO: ? extends ?
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
 * ...
 */
User.prototype.find = function(params, cb) {
  this.db.collection(User.COLLECTION_).
      findOne(params, function(err, user) {
        return cb(err, user);
      });
};


/**
 * ...
 */
User.prototype.findOne = function(params, cb) {
  this.db.collection(User.COLLECTION_).
      findOne(params, function(err, user) {
        return cb(err, user);
      });
};
