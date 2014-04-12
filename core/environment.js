/**
 * @param {function(Object, Object, Function)} app Express application instance.
 */
module.exports = function(app) {
  var rootPath = app.get('ROOT PATH');
  app.set('views', rootPath + '/app/views');
  app.set('view engine', 'jade');
};
