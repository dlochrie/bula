var Post = require('../models/post');


/**
 * Expose `Main` Controller.
 */
module.exports = new Main;



/**
 * Main Controller.
 * @constructor
 */
function Main() {}


/**
 * Renders main/home index page.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Main.prototype.index = function(req, res) {
  var post = new Post(req.app);
  post.find(function(err, results) {
    if (err || !results) {
      req.flash('error', 'There was an error getting the posts: ' + err);
      res.redirect('/');
    } else {
      res.render('main/index', {
        title: 'Home',
        results: results
      });
    }
  });
};


/**
 * Renders main/home about page.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Main.prototype.about = function(req, res) {
  res.render('main/about', {title: 'About'});
};


/**
 * Renders main/home contact page.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Main.prototype.contact = function(req, res) {
  res.render('main/contact', {title: 'Contact'});
};


/**
 * Renders main/home login page.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Main.prototype.login = function(req, res) {
  res.render('main/login', {title: 'Login'});
};
