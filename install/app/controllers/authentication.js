var passport = require('passport'),
    User = require('../models/user');


/**
 * Expose `Authentication` Controller.
 */
module.exports = new Authentication;



/**
 * Authentication controller constructor.
 * @constructor
 */
function Authentication() {}


/**
 * Logs the user out.
 * If there is a session, it will be regenerated with a clean session.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Authentication.prototype.logout = function(req, res) {
  var session = req.session;
  session.logged_in = false;
  req.logOut();
  if (!session || !session.regenerate) {
    res.redirect('/');
  } else {
    session.regenerate(function(err) {
      // TODO: Handle an error here.
      res.redirect('/');
    });
  }
};
