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
  var env = req.app.get('NODE ENVIRONMENT').toLowerCase();
  session.logged_in = false;

  // TODO: Handle this more elegantly.
  // This is a Hack for testing. Right now, Passport throws a fit because it
  // does not have access to this._passport inside our testing suites, and
  // therefore it can't execute req.logOut();
  if (this._passport) {
    req.logOut();
  } else if (env === 'test') {
    session.passport = {};
    delete res.locals.user;
  }

  if (!session || !session.regenerate) {
    res.redirect('/');
  } else {
    session.regenerate(function(err) {
      // TODO: Handle an error here.
      res.redirect('/');
    });
  }
};
