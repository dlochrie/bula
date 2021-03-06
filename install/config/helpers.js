/**
 * Expose the Helpers Conf Module.
 */
module.exports = Helpers;



/**
 * Loads all helper files, and attaches them to the global `app.locals`.
 * @param {function(Object, Object, Function)} app Express application instance.
 * @constructor
 */
function Helpers(app) {
  var dir = app.get('ROOT PATH') + 'app/helpers',
      fs = require('fs'),
      helpers = fs.readdirSync(dir);

  helpers.forEach(function(helper) {
    var Helper = require(dir + '/' + helper);
    app.locals[Helper.name] = require(dir + '/' + helper);
  });
}
