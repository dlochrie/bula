// Expose `User` Model
module.exports = User;



/**
 * @constructor
 */
function User(app, resource) {
  this.app = app;
}

User.prototype.find = function(params, cb) {
  return cb(null, [{}]);
};
