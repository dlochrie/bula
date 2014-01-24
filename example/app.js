/**
 * Module dependencies.
 */
var express = require('express'),
  http = require('http'),
  path = require('path');

var app = express();

/**
 * Initialize the Application.
 */
require('../init')(app);


/** Override for sake of example, please don't do this. */
app.set('views', app.get('ROOT PATH') + '/app/views');

http.createServer(app).listen(
    app.get('NODE PORT'), app.get('NODE HOST'), function() {
  
  // TODO: Add More checks, but in a more elegant fashion.
  if (!app.get('SITE OWNER')) {
    throw 'The owner of this site MUST be specified';
  }
  
  console.log('Express server listening on port ' + app.get('NODE PORT') +
      ' in the `' + app.get('NODE ENVIRONMENT') +
      '` environment on address ' + app.get('NODE HOST') + '.');
  console.log('`URL ROOT`: ' + app.get('ROOT URL'));
  console.log('`APP ROOT`: ' + app.get('ROOT PATH'));
});