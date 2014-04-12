/**
 * Base Middleware Module
 * @param {function(Object, Object, Function)} app Express application instance.
 */
module.exports = function(app) {
  /**
   * Make the User's Name available to Views
   */
  app.use(function(req, res, next) {
    if (req.session.logged_in) {
      res.locals.user = req.session.passport.user;
    }

    // TODO: See if these are even if use - if so, FOMALIZE THEM.
    res.locals.title =
        'A nice title here!';
    res.locals.description =
        'A nice desciption here.';
    res.locals.canonical = app.get('ROOT URL').replace(/\/$/, '') + req.url;
    next();
  });

  /**
   * Expose Flash Middleware to Views.
   */
  app.use(function(req, res, next) {
    res.locals.messages = req.flash();
    next();
  });
};
