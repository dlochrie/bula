var Util = require('../util');
var Post = require('../../models/post');


/**
 * Expose `AdminPosts` Controller.
 */
module.exports = new AdminPosts;



/**
 * AdminPosts Controller.
 * @constructor
 */
function AdminPosts() {}


/**
 * Path to posts index page.
 * @private {string}
 * @const
 */
AdminPosts.INDEX_VIEW_ = 'admin/posts/';


/**
 * Path to posts create view.
 * @private {string}
 * @const
 */
AdminPosts.CREATE_VIEW_ = 'admin/posts/new';


/**
 * Path to posts edit view.
 * @private {string}
 * @const
 */
AdminPosts.UPDATE_VIEW_ = 'admin/posts/edit';


/**
 * Path to posts delete view.
 * @private {string}
 * @const
 */
AdminPosts.DELETE_VIEW_ = 'admin/posts/delete';


/**
 * Renders posts' admin index page - lists all posts.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminPosts.prototype.index = function(req, res) {
  var post = new Post(req.app);
  var params = req.body;
  post.find(params, function(err, results) {
    if (err || !results) {
      req.flash('error', 'There was an error getting the posts: ' + err);
      res.redirect('/admin');
    } else {
      res.render(AdminPosts.INDEX_VIEW_, {
        title: 'Posts Administration',
        results: results
      });
    }
  });
};


/**
 * Renders posts' create form.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminPosts.prototype.new = function(req, res) {
  var post = new Post(req.app);
  res.render('admin/posts/new', {
    title: 'Create Post',
    errors: [],
    result: {post: {}, user: {}},
    token: res.locals.token
  });
};


/**
 * Saves new post or displays creation errors.
 * Only on creation should a Slug be added - updating them on edit might break
 * permalinks for users.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminPosts.prototype.create = function(req, res) {
  var post = new Post(req.app, null);
  var params = req.body;

  post.insert(params, function(errors, post) {
    if (errors || !post) {
      req.flash('error', 'There was an error creating the post: ');
      // TODO: WE might have to redirect... and then bind these vars...
      res.render(AdminPosts.CREATE_VIEW_, {
        title: 'Create Post',
        errors: errors,
        result: {post: params, user: {}},
        token: res.locals.token
      });
    } else {
      req.flash('success', 'Post Successfully Created');
      res.redirect(AdminPosts.INDEX_VIEW_);
    }
  });
};


/**
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminPosts.prototype.edit = function(req, res) {
  var post = new Post(req.app, null),
      slug = req.params.post;

  post.findOne({slug: slug}, function(err, result) {
    if (err || !result) {
      req.flash('error', 'There was an error editing the post: ' + err);
      res.redirect(AdminPosts.INDEX_VIEW_);
    } else {
      res.render(AdminPosts.UPDATE_VIEW_, {
        title: 'Edit Post', result: result, token: res.locals.token
      });
    }
  });
};


/**
 * Updates the post.
 * Note: The Slug SHOULD NOT be modified here so that bookmarks are persisted.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminPosts.prototype.update = function(req, res) {
  var post = new Post(req.app, null),
      slug = req.params.post,
      params = req.body;

  params.body_md = Util.sanitize(params.body);
  params.description_md = Util.sanitize(params.description);
  params.updated = Util.getDate();

  post.update({slug: slug}, params, function(err) {
    if (err) {
      req.flash('error', 'There was an error editing the post: ' + err);
      res.redirect('/admin/posts/' + slug + '/edit');
    } else {
      req.flash('success', 'Post Successfully Updated');
      res.redirect(AdminPosts.INDEX_VIEW_);
    }
  });
};


/**
 * Renders the delete form.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminPosts.prototype.delete = function(req, res) {
  var post = new Post(req.app, null),
      slug = req.params.post;
  post.findOne({slug: slug}, function(err, result) {
    if (err || !result) {
      req.flash('error', 'There was an error deleting the post: ' + err);
      res.redirect(AdminPosts.INDEX_VIEW_);
    } else {
      res.render(AdminPosts.DELETE_VIEW_, {
        title: 'Delete Post', result: result, token: res.locals.token
      });
    }
  });
};


/**
 * Attempts to delete the resource and displays success or failure.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminPosts.prototype.destroy = function(req, res) {
  var post = new Post(req.app, null),
      slug = req.params.post;
  post.remove({slug: slug}, function(err) {
    if (err) {
      req.flash('error', 'There was an error deleting the post: ' + err);
    } else {
      req.flash('info', 'Post Successfully Deleted.');
    }
    res.redirect(AdminPosts.INDEX_VIEW_);
  });
};
