var User = require('../models/user');


/**
 * Expose `Users` Controller.
 */
module.exports = new Users;


function Users() {}


/**
 * Quick and easy authorization for an administrator. Flashes a message and
 * redirects a user to the home page if they are not logged in.
 * For now, ONLY a SITE_OWNER can be authorized.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 * @param {Function} next Express callback function.
 */
Users.prototype.authenticate = function(req, res, next) {
  var user = res.locals.user || null;
  var owners = req.app.get('SITE OWNERS') || [];
  if (user && (owners.indexOf(user.email) !== -1)) {
    next();
  } else {
    req.flash('error', 'This action is unauthorized.');
    res.redirect('/');
  }
};


/**
 * Renders users' index page - lists all users.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Users.prototype.index = function(req, res) {
  var user = new User(req.app, req.body || {});
  user.find(function(err, results) {
    if (err || !results) {
      req.flash('error', 'There was an error getting the users: ' + err);
      res.redirect('/');
    } else {
      res.render('users/index', {
        title: 'Listing Users',
        description: 'Browse Site Users',
        results: results
      });
    }
  });
};


/**
 * Renders a users's "show" page.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Users.prototype.show = function(req, res) {
  var user = new User(req.app, req.body || {});
  user.findOne(function(err, result) {
    if (err || !result) {
      req.flash('error', 'There was an error getting the user: ' + err);
      res.redirect('/users');
    } else {
      // TODO: Strip Tags from the description.
      res.render('users/show', {
        title: result.user.title,
        description: result.user.description,
        result: result
      });
    }
  });
};
