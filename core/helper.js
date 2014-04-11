/**
 * Base Helper Module
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


  /**
   * Returns a 'Human-Readable' date string.
   * Requires the use of the `moment` library.
   * @param {string} date The date string.
   * @return {string} A human-readable date string.
   */
  app.locals.getHumanDate = function(date) {
    return require('moment')(date).format('MMMM Do YYYY, [at] h:mm:ss A');
  };

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
