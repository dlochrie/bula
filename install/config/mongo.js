var MongoClient = require('mongodb').MongoClient;


/**
 * Expose Mongo
 */
module.exports = Mongo;



/**
 * @constructor
 * @param {Function} app Instance of Express App.
 */
function Mongo(app) {
  var self = this;

  MongoClient.connect(Mongo.CONNECTION_STRING_, function(err, connection) {
    if (err) {
      throw 'Could not connect to MongoDB: ' + err;
    } else {
      console.log('Successfully connected to MongoDB.');
      self.db = app.db = {
        connection: connection,
        type: 'mongodb'
      };
    }
  });
}


/**
 * TODO: This should come from config.
 * @const {string}
 */
Mongo.CONNECTION_STRING_ = 'mongodb://127.0.0.1:27017/test';


/**
 * @const
 * @enum {string}
 */
Mongo.CONNECTION_OPTIONS_ = {
  // TODO: ...Add here...
};
