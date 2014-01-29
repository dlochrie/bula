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

  MongoClient.connect(Mongo.CONNECTION_STRING_, function(err, db) {
    if (err) throw 'Could not connect to MongoDB: ' + err;
    app.db = db;
  });
}


/**
 * TODO: This should come from config.
 * @const {string}
 */
Mongo.CONNECTION_STRING_ = 'mongodb://127.0.0.1:27017/test';


/**
 * Get all rows matching criteria.
 */
Mongo.prototype.find = function(model, params, cb) {
  var collection = this.db.collection(model);
  collection.find().toArray(function(err, results) {
    // Close the db
    db.close();
  });
};


/**
 * Get one or first row matching criteria.
 */
Mongo.prototype.findOne = function(model, params, cb) {
  var collection = this.db.collection(model);
  collection.findOne(params, function(err, result) {
    // Close the db
    db.close();
    return cb(err, result);
  });
};


/**
 * Get one or first row matching criteria.
 */
Mongo.prototype.insert = function() {};
Mongo.prototype.update = function() {};
Mongo.prototype.save = function() {};
Mongo.prototype.remove = function() {};
Mongo.prototype.validate = function() {};
