/**
 * Expose `DateHelper` Constructor.
 */
module.exports = DateHelper;



/**
 * The DateHelper helper contains methods that help generate months and years
 * for display the in archives sidebar.
 * @constructor
 */
function DateHelper() {}


/**
 * @const
 * @type {!Array.<!string>}
 * @private
 */
DateHelper.MONTHS_ = [
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
 * Gets the current date.
 * @return {Date} New date object
 */
DateHelper.getDate = function() {
  return new Date();
};


/**
 * Returns a 'Human-Readable' date string.
 * Requires the use of the `moment` library.
 * @param {string} date The date string.
 * @return {!string} A human-readable date string.
 */
DateHelper.getHumanDate = function(date) {
  // Check if this is date object, or a number (for timestamps).
  var isDate = date && (date instanceof Date || !isNaN(date));
  date = isDate ? date : DateHelper.getDate();
  return require('moment')(date).format('MMMM Do YYYY, h:mm:ss A');
};


/**
 * Returns an array of the last 3 months.
 * @return {!Array} Last 3 months.
 */
DateHelper.lastThreeMonths = function() {
  var now = new Date().getMonth();
  var months = DateHelper.MONTHS_;
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
 * @return {!Array} Last 3 years.
 */
DateHelper.lastThreeYears = function() {
  var year = new Date().getFullYear();
  return [year - 1, year - 2, year - 3];
};
