var Util = require('../util');
var User = require('../../models/user');


/**
 * Expose `AdminUsers` Controller.
 */
module.exports = new AdminUsers;



/**
 * AdminUsers Controller.
 * @constructor
 */
function AdminUsers() {}


/**
 * Path to users index page.
 * @const
 * @private {string}
 */
AdminUsers.INDEX_VIEW_ = 'admin/users/';


/**
 * Path to users create view.
 * @const
 * @private {string}
 */
AdminUsers.CREATE_VIEW_ = 'admin/users/new';


/**
 * Path to users edit view.
 * @const
 * @private {string}
 */
AdminUsers.UPDATE_VIEW_ = 'admin/users/edit';


/**
 * Path to users delete view.
 * @const
 * @private {string}
 */
AdminUsers.DELETE_VIEW_ = 'admin/users/delete';


/**
 * Renders users' admin index pagelists all users.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.index = function(req, res) {
  var user = new User(req.app, req.body);
  user.find(function(err, results) {
    if (err || !results) {
      req.flash('error', 'There was an error getting the users: ' + err);
      res.redirect('/admin');
    } else {
      res.render(AdminUsers.INDEX_VIEW_, {
        title: 'Users Administration',
        results: results
      });
    }
  });
};


/**
 * Renders users' create form.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.new = function(req, res) {
  res.render('admin/users/new', {
    title: 'Create User',
    user: {},
    token: res.locals.token
  });
};


/**
 * Saves new user or displays creation errors.
 * Only on creation should a Slug be added - updating them on edit might break
 * permalinks for users.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.create = function(req, res) {
  // TODO: We really should pass in the resource...
  var user = new User(req.app, null);
  var params = User.validate(req.body, function(err, resource) {
    user.insert(params, function(err, user) {
      if (err || !user) {
        req.flash('error', 'There was an error creating the user: ' + err);
        res.redirect(AdminUsers.INDEX_VIEW_);
      } else {
        req.flash('success', 'User Successfully Created');
        res.redirect(AdminUsers.INDEX_VIEW_);
      }
    });
  });
};


/**
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.edit = function(req, res) {
  var user = new User(req.app, null),
      slug = req.params.user;

  user.findOne({slug: slug}, function(err, result) {
    if (err || !result) {
      req.flash('error', 'There was an error editing the user: ' + err);
      res.redirect(AdminUsers.INDEX_VIEW_);
    } else {
      res.render('admin/users/edit', {
        title: 'Edit User', result: result, token: res.locals.token
      });
    }
  });
};


/**
 * Updates the user.
 * Note: The Slug SHOULD NOT be modified here so that bookmarks are persisted.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.update = function(req, res) {
  var user = new User(req.app, null),
      slug = req.params.user,
      params = req.body;

  params.body_md = Util.sanitize(params.body);
  params.description_md = Util.sanitize(params.description);
  params.updated = Util.getDate();

  user.update({slug: slug}, params, function(err) {
    if (err) {
      req.flash('error', 'There was an error editing the user: ' + err);
      res.redirect('/admin/users/' + slug + '/edit');
    } else {
      req.flash('success', 'User Successfully Updated');
      res.redirect(AdminUsers.INDEX_VIEW_);
    }
  });
};


/**
 * Renders the delete form.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.delete = function(req, res) {
  var user = new User(req.app, null),
      slug = req.params.user;
  user.findOne({slug: slug}, function(err, result) {
    if (err || !result) {
      req.flash('error', 'There was an error deleting the user: ' + err);
      res.redirect(AdminUsers.INDEX_VIEW_);
    } else {
      res.render('admin/users/delete', {
        title: 'Delete User', result: result, token: res.locals.token
      });
    }
  });
};


/**
 * Attempts to delete the resource and displays success or failure.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.destroy = function(req, res) {
  var user = new User(req.app, null),
      slug = req.params.user;
  user.remove({slug: slug}, function(err) {
    if (err) {
      req.flash('error', 'There was an error deleting the user: ' + err);
    } else {
      req.flash('info', 'User Successfully Deleted.');
    }
    res.redirect(AdminUsers.INDEX_VIEW_);
  });
};
