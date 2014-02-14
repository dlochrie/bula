/**
 * The Archives helper contains methods that help generate months and years
 * for display the archive sidebar.
 */
module.exports = function(app) {
  /**
   * @constructor
   */
  app.locals.Archives = function() {};


  /**
   * @const
   * @type {Array.<string>}
   */
  app.locals.Archives.MONTHS_ = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];


  /**
   * Returns an array of the last 3 months.
   * @return {Array} Last 3 months.
   */
  app.locals.Archives.lastThreeMonths = function() {
    var now = new Date().getMonth();
    var months = app.locals.Archives.MONTHS_;
    var output = [];
    switch (now) {
      case 0:
        /** January */
        output.push(months[0]);
        output = output.concat(months.slice(10, 12).reverse());
        break;
      case 1:
        /** February */
        output = months.slice(0, 2).reverse();
        output.push(months[11]);
        break;
      default:
        /** March - December */
        output = months.slice(now - 2, now + 1).reverse();
        break;
    }
    return output;
  };


  /**
   * Returns an array of the last 3 years.
   * @return {Array} Last 3 years.
   */
  app.locals.Archives.lastThreeYears = function() {
    var year = new Date().getFullYear();
    return [year - 1, year - 2, year - 3];
  };
};
