var Post = require('../models/post');


/**
 * Expose `Posts` Controller.
 */
module.exports = new Posts;



/**
 * Posts Controller.
 * @constructor
 */
function Posts() {}


/**
 * Path to posts index page.
 * @private {string}
 * @const
 */
Posts.INDEX_VIEW_ = 'posts/';


/**
 * Path to posts show view.
 * @private {string}
 * @const
 */
Posts.SHOW_VIEW_ = 'posts/show';


/**
 * Renders posts' index page - lists all posts.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Posts.prototype.index = function(req, res) {
  var params = req.body || {};
  var post = new Post(req.app, params);
  post.find(function(err, results) {
    if (err || !results) {
      req.flash('error', 'There was an error getting the posts: ' + err);
      res.redirect('/');
    } else {
      res.render('posts/index', {
        title: 'Latest Posts',
        description: 'Browse the latest posts.',
        results: results
      });
    }
  });
};
