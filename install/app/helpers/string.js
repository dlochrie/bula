var util = require('util');


/**
 * Expose `StringHelper` Constructor.
 */
module.exports = StringHelper;



/**
 * The string helper provides methods for formatting strings for slugs, errors,
 * and more.
 * @constructor
 */
function StringHelper() {}


/**
 * Converts markdown-formatted text into HTML using the 'marked' Node Module.
 * @param {string} text String to convert.
 * @return {!string} Converted text.
 */
StringHelper.convertMarkdown = function(text) {
  var str = (Object.prototype.toString.call(text) === '[object String]') ?
      text : ''
  return require('marked')(str);
};


/**
 * Converts a string into a friendly url string.
 * @param {?string} text The string to convert.
 * @return {!string} The converted string.
 */
StringHelper.convertToSlug = function(text) {
  return (text || '').
      toString().
      toLowerCase().
      replace(/[^\w ]+/g, '').
      replace(/ +/g, '-');
};


/**
 * Creates and returns an html list for outputting errors.
 * @param {!string} action The action performed when errors happened.
 * @param {!string||!Array} errors The errors to create a new group for.
 * @return {!string} The html error group.
 */
StringHelper.createErrorGroup = function(action, errors) {
  // Coerce the errors into an array.
  errors = util.isArray(errors) ? errors : [errors];
  // Initialize the errors list.
  var list = '';
  if (errors.length) {
    errors.forEach(function(error) {
      if (error) {
        list += util.format(StringHelper.ERROR_GROUP_MSG_STRING_, error);
      }
    });
  } else {
    list += util.format(StringHelper.ERROR_GROUP_MSG_STRING_,
        StringHelper.ERROR_GROUP_MSG_EMPTY_);
  }
  return util.format(StringHelper.ERROR_GROUP_WRAPPER_, action, list);
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
StringHelper.sanitize = function(resource) {
  return resource ? resource.toString().trim() : '';
};


/**
 * The default message string to display when no errors are found to display.
 * @const
 * @type {string}
 * @private
 */
StringHelper.ERROR_GROUP_MSG_EMPTY_ = 'There was a system error.';


/**
 * The default message string for error group items.
 * @const
 * @type {string}
 * @private
 */
StringHelper.ERROR_GROUP_MSG_STRING_ =
    '<li><i class="fa fa-flash"></i> %s</li>';


/**
 * The header and wrappper for error groups.
 * @const
 * @type {string}
 * @private
 */
StringHelper.ERROR_GROUP_WRAPPER_ =
    '<strong>The following errors were encountered while %s:</strong>' +
    '<ul>%s</ul>';
