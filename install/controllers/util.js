/**
 * Expose `Util` Controller
 */
module.exports = Util;



/**
 * Utility Controller.
 *
 * TODO: Should this be a controller, or just a class???
 *
 * @constructor
 */
function Util() {}


/**
 * Converts a string into a friendly url string.
 * @param {string} text The string to convert.
 * @return {string} The converted string.
 */
Util.convertToSlug = function(text) {
  return (text || '')
      .toString()
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
};


/**
 * Gets the current date.
 * @return New date object
 */
Util.getDate = function() {
  return new Date();
};


/**
 * Converts the date to 'Month Day, Year HH:MM' format.
 * @param {string} date The date string to format.
 * @return New date object
 */
Util.getHumanDate = function(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};


/**
 * Returns a trimmed version of the string.

 * TODO: See this link for some crazy awesome HTML sanitization:
 * https://code.google.com/p/google-caja/source/browse/trunk/src/com/
 * --> google/caja/plugin/html-sanitizer.js
 *
 * @param {string} resource The string to sanitize.
 * @return The sanitized string.
 */
Util.sanitize = function(resource) {
  return resource ?
      resource.toString().trim() : '';
};
