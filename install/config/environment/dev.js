/**
 * Development environment-specific settings and middleware.
 * @param {function(Object, Object, Function)} app Express application instance.
 * @param {Function} express Express/Connect instance.
 */
module.exports = function(app, express) {
  app.use(express.logger());
};
