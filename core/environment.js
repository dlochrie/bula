/**
 * Base Environment Module.
 * Sets default global application variables.
 * @param {function(Object, Object, Function)} app Express application instance.
 */
module.exports = function(app) {
  var fs = require('fs');

  // Set up site globals - these are based off of Environmental variables.
  var env = (process.env.NODE_ENV || 'dev').toUpperCase();
  app.set('NODE ENVIRONMENT', env);

  // Check to see if the application has defined its own custom global property
  // names. This is useful for environments hosting multiple applications.
  var custom = process.cwd() + '/config/globals.json';
  var conf = (fs.existsSync(custom) && fs.lstatSync(custom).isFile()) ? custom :
      './globals.json';
  var globals = require(conf).properties || [];
  globals.forEach(function(global) {
    var defaultValue = global.default || null,
        value = process.env[env + global.systemName] || defaultValue;
    app.set(global.name, value);
  });

  // Extract the Site Owners and store as global.
  var owners = app.get('SITE OWNERS');
  var ownersList = owners ? owners.split(',') : [];
  var siteOwners = ownersList.map(function(owner) {
    // TODO: Maybe also verify if this is an email address or not.
    return owner.trim();
  });
  app.set('SITE OWNERS', siteOwners);

  // Sets the default view engine as "jade". This can be overridden in the
  // application's environment confs.
  var rootPath = app.get('ROOT PATH');
  app.set('views', rootPath + '/app/views');
  app.set('view engine', 'jade');
};
