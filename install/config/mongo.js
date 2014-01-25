var mongodb = require('mongodb');


/**
 * Expose Mongo
 */
module.exports = Mongo;


/**
 * @constructor
 * @param {Function} app Instance of Express App.
 */
function Mongo(app) {
  var MongoClient = require('mongodb').MongoClient,
      format = require('util').format;

  MongoClient.connect(Mongo.CONNECTION_STRING_, function(err, db) {
    // TODO: DO NOT CONTINUE IF ERROR!!!!!!!!!!!!
    if (err) throw err;

    var collection = db.collection('test_insert');
    collection.insert({a: 2}, function(err, docs) {

      collection.count(function(err, count) {
        console.log(format('count = %s', count));
      });

      // Locate all the entries using find
      collection.find().toArray(function(err, results) {
        console.dir(results);
        // Let's close the db
        db.close();
      });
    });
  });
}


// TODO: This should come from config.
Mongo.CONNECTION_STRING_ = 'mongodb://127.0.0.1:27017/test';


/**
 * Get all rows matching criteria.
 */
Mongo.prototype.find = function() {};


/**
 * Get one or first row matching criteria.
 */
Mongo.prototype.findOne = function() {};


/**
 * Get one or first row matching criteria.
 */
Mongo.prototype.insert = function() {};
Mongo.prototype.update = function() {};
Mongo.prototype.save = function() {};
Mongo.prototype.remove = function() {};
Mongo.prototype.validate = function() {};
