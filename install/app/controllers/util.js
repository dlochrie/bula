var util = require('util');


/**
 * Expose `Util` Controller
 */
module.exports = Util;



/**
 * Utility Controller.
 * TODO: Should this be a controller, or just a class???
 * @constructor
 */
function Util() {}


/**
 * Converts markdown-formatted text into HTML using the 'marked' Node Module.
 * @param {string} text String to convert.
 * @return {!string} Converted text.
 */
Util.convertMarkdown = function(text) {
  return require('marked')(text || '');
};


/**
 * Converts a string into a friendly url string.
 * @param {?string} text The string to convert.
 * @return {!string} The converted string.
 */
Util.convertToSlug = function(text) {
  return (text || '').
      toString().
      toLowerCase().
      replace(/[^\w ]+/g, '').
      replace(/ +/g, '-');
};


/**
 * Gets the current date.
 * @return {Date} New date object
 */
Util.getDate = function() {
  return new Date();
};


/**
 * Returns a trimmed version of the string.

 * TODO: See this link for some crazy awesome HTML sanitization:
 * https://code.google.com/p/google-caja/source/browse/trunk/src/com/
 * --> google/caja/plugin/html-sanitizer.js
 *
 * @param {?string} resource The string to sanitize.
 * @return {!string} The sanitized string.
 */
Util.sanitize = function(resource) {
  return resource ? resource.toString().trim() : '';
};


/**
 * Creates and returns an html list for outputting errors.
 * @param {!string} action The action performed when errors happened.
 * @param {!string||!Array} errors The errors to create a new group for.
 * @return {!string} The html error group.
 */
Util.createErrorGroup = function(action, errors) {
  // Coerce the errors into an array.
  errors = util.isArray(errors) ? errors : [errors];
  // Initialize the errors list.
  var list = '';
  if (errors.length) {
    errors.forEach(function(error) {
      if (error) {
        list += util.format(Util.ERROR_GROUP_MSG_STRING_, error);
      }
    });
  } else {
    list += util.format(Util.ERROR_GROUP_MSG_STRING_,
        Util.ERROR_GROUP_MSG_EMPTY_);
  }
  return util.format(Util.ERROR_GROUP_WRAPPER_, action, list);
};


/**
 * The default message string to display when no errors are found to display.
 * @const
 * @type {string}
 * @private
 */
Util.ERROR_GROUP_MSG_EMPTY_ = 'There was a system error.';


/**
 * The default message string for error group items.
 * @const
 * @type {string}
 * @private
 */
Util.ERROR_GROUP_MSG_STRING_ = '<li><i class="fa fa-flash"></i> %s</li>';


/**
 * The header and wrappper for error groups.
 * @const
 * @type {string}
 * @private
 */
Util.ERROR_GROUP_WRAPPER_ =
    '<strong>The following errors were encountered while %s:</strong>' +
    '<ul>%s</ul>';
