/**
 * Base Environment Module.
 * Sets default global application variables.
 * @param {function(Object, Object, Function)} app Express application instance.
 */
module.exports = function(app) {
  // Set up site globals - these are based off of Environmental variables.
  var env = (process.env.NODE_ENV || 'dev').toUpperCase();
  app.set('NODE ENVIRONMENT', env);
  var globals = require('./globals.json').properties;
  globals.forEach(function(global) {
    var defaultValue = global.default || null,
        value = process.env[env + global.systemName] || defaultValue;
    app.set(global.name, value);
  });

  // Extract the Site Owners and store as global.
  var owners = process.env[env + '_SITE_OWNERS'];
  var ownersList = owners ? owners.split(',') : [];
  var siteOwners = ownersList.map(function(owner) {
    // TODO: Maybe also verify if this is an email address or not.
    return owner.trim();
  });
  app.set('SITE OWNERS', siteOwners);

  // Sets the default view engine as "jade".
  var rootPath = app.get('ROOT PATH');
  app.set('views', rootPath + '/app/views');
  app.set('view engine', 'jade');
};
