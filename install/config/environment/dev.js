/**
 * Development environment-specific settings.
 */
module.exports = function(app, express) {
  app.use(express.logger());
};
