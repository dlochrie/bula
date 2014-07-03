/**
 * Expose `UserHelper` Constructor.
 */
module.exports = UserHelper;



/**
 * Users helper. Provides view helper methods.
 * @constructor
 */
function UserHelper() {}


/**
 * Checks to see if the user is an Owner.
 * @param {Object.<string, string>} user User object.
 * @return {boolean} Whether the user is an owner or not.
 */
UserHelper.isOwner = function(user) {
  return user ? (app.get('SITE OWNERS').indexOf(user.email) !== -1) : false;
};
