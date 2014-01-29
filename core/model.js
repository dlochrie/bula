/**
 * Base Model Module
 */
module.exports = Model;



/**
 * This Class works like an interface - methods should have an override in the
 * appropriate adapter.
 * @constructor
 */
function Model(app) {};


Model.prototype.find = function() {
  throw 'Please supply a database adapter.';
};


Model.prototype.findOne = function() {
  throw 'Please supply a database adapter.';
};


Model.prototype.insert = function() {
  throw 'Please supply a database adapter.';
};


Model.prototype.update = function() {
  throw 'Please supply a database adapter.';
};


Model.prototype.save = function() {
  throw 'Please supply a database adapter.';
};


Model.prototype.remove = function() {
  throw 'Please supply a database adapter.';
};


Model.prototype.validate = function() {
  throw 'Please supply a database adapter.';
};
