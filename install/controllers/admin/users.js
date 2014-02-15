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
 * Users admin index page.
 * @private {string}
 * @const
 */
AdminUsers.INDEX_PAGE_ = 'admin/users/';


/**
 * Users admin create page.
 * @private {string}
 * @const
 */
AdminUsers.CREATE_PAGE_ = 'admin/users/new';


/**
 * THESE TWO: Don't they need the slug???
 */
AdminUsers.UPDATE_PAGE_ = 'admin/users/edit';
AdminUsers.DELETE_PAGE_ = 'admin/users/delete';


/**
 * Renders users' admin index page - lists all users.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.index = function(req, res) {
  var user = new User(req.app);
  var params = req.body;
  user.find(params, function(err, users) {
    if (err || !users) {
      req.flash('error', 'There was an error getting the users: ' + err);
      return res.redirect('/admin');
    }
    res.render(AdminUsers.INDEX_PAGE_, {
      title: 'Users Administration',
      users: users
    });
  });
};


/**
 * Renders users' create form.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.new = function(req, res) {
  // TODO: Is this really neccessary? Isn't it available already???
  var user = res.locals.user || null;
  var user = new User(req.app);
  res.render('admin/users/new', {
    title: 'Create User',
    user: user,
    user: user,
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
  var user = new User(req.app, null);
  var params = req.body;


  // TODO: JUST TESTING... SHOULD BE VALIDATED!!!
  var now = Util.getDate();
  params.created = now;
  params.updated = now;

  params.slug = Util.getDate().getTime();
  params.body_md = Util.sanitize(params.body);
  params.description_md = Util.sanitize(params.description);

  console.log('params', params);


  user.insert(params, function(err, user) {
    if (err || !user) {
      req.flash('error', 'There was an error creating the user: ' + err);
      res.redirect(AdminUsers.INDEX_PAGE_);
    } else {
      req.flash('success', 'User Successfully Created');
      res.redirect(AdminUsers.INDEX_PAGE_);
    }
  });
};


/**
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 */
AdminUsers.prototype.edit = function(req, res) {
  var user = new User(req.app, null),
      slug = req.params.user;

  user.findOne({slug: slug}, function(err, user) {
    if (err || !user) {
      req.flash('error', 'There was an error editing the user: ' + err);
      res.redirect(AdminUsers.INDEX_PAGE_);
    } else {
      res.render('admin/users/edit', {
        title: 'Edit User', user: user, token: res.locals.token
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
      res.redirect(AdminUsers.INDEX_PAGE_);
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
  console.log('slug', slug);
  user.findOne({slug: slug}, function(err, user) {
    if (err || !user) {
      req.flash('error', 'There was an error deleting the user: ' + err);
      res.redirect(AdminUsers.INDEX_PAGE_);
    } else {
      res.render('admin/users/delete', {
        title: 'Delete User', user: user, token: res.locals.token
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
    res.redirect(AdminUsers.INDEX_PAGE_);
  });
};
