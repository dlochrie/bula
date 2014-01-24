/**
 * Base Helper Module
 */
module.exports = function(app) {
  /**
   * Make the User's Name available to Views
   */
  app.use(function(req, res, next) {
    if (req.session.logged_in) {
      res.locals.user = req.session.passport.user;
    }
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

  // TODO: Put this here????
  // TODO: Doesn't seem to be putting ellipses on the correct string length.
  app.locals.truncateAndStripTags = function(string, maxLength) {
    var original = string;
    if (string) {
      string = string
          .replace(/(<([^>]+)>)/ig, '')
          .substring(0, maxLength);
      if (original.length >= maxLength) {
        string += '&hellip;';
      }
      return string;
    }
  };
};