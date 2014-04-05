/**
 * Module dependencies.
 */
var express = require('express'),
    resource = require('express-resource'),
    fs = require('fs'),
    http = require('http'),
    path = require('path'),
    app = express();


/**
 * Initialize the Application.
 */
require('../init')(app, express);


/**
 * Start the application.
 */
http.createServer(app).listen(
    app.get('NODE PORT'), app.get('NODE HOST'), function() {

      // TODO: Add checks for Site Variables....

      console.log('Express server listening on port ' + app.get('NODE PORT') +
          ' in the `' + app.get('NODE ENVIRONMENT') +
          '` environment on address ' + app.get('NODE HOST') + '.');
      console.log('`URL ROOT`: ' + app.get('ROOT PATH'));
      console.log('`APP ROOT`: ' + app.get('ROOT URL'));
    });
