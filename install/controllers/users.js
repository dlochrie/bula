/**
 * Quick and easy authorization for an administrator. Flashes a message and
 * redirects a user to the home page if they are not logged in.
 * For now, ONLY a SITE_OWNER can be authorized.
 *
 * @param {!express.request} req Express request object/function.
 * @param {!express.response} res Express response object/function.
 * @param {function} next Express callback function.
 */
exports.authenticate = function(req, res, next) {
  var user = res.locals.user || null;
  var owners = req.app.get('SITE OWNERS') || [];
  if (user && (owners.indexOf(user.email) !== -1)) {
    return next();
  }
  req.flash('error', 'This action is unauthorized.');
  res.redirect('/');
};
