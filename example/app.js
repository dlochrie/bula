/**
 * Module dependencies.
 */
var express = require('express'),
  fs = require('fs'),
  http = require('http'),
  path = require('path');

var app = express();

/**
 * Initialize the Application.
 */
require('../init')(app, express);

var rootPath = app.get('ROOT PATH'),
  rootUrl = app.get('ROOT URL'),
  env = app.get('NODE ENVIRONMENT');

/**
 * Start the application.
 */
http.createServer(app).listen(
    app.get('NODE PORT'), app.get('NODE HOST'), function() {

  // TODO: Add checks for Site Variables....

  console.log('Express server listening on port ' + app.get('NODE PORT') +
      ' in the `' + env + '` environment on address ' +
      app.get('NODE HOST') + '.');
  console.log('`URL ROOT`: ' + rootPath);
  console.log('`APP ROOT`: ' + rootUrl);
});
