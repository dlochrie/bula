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
  var post = new Post(req.app, req.body || {});
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


/**
 * Renders a post's show page - displays the post as an article.
 * @param {http.IncomingMessage} req Node/Express request object.
 * @param {http.ServerResponse} res Node/Express response object.
 */
Posts.prototype.show = function(req, res) {
  var post = new Post(req.app, req.body || {});
  post.findOne(function(err, result) {
    if (err || !result) {
      req.flash('error', 'There was an error getting the post: ' + err);
      res.redirect('/posts');
    } else {
      // TODO: Strip Tags from the description.
      res.render('posts/show', {
        title: result.post.title,
        description: result.post.description,
        result: result
      });
    }
  });
};
