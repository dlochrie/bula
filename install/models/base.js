/**
 * Base model class.
 * This Class works like an interface - methods should have an override in the
 * appropriate adapter.
 */
module.exports = Base;



/**
 * Base model constructor.
 * @param {express.app} app Express app function.
 * @interface
 */
function Base() {
  this.app.models = {base: this};
}


Base.prototype.find = function() {
  throw 'Please supply a database adapter.';
};


Base.prototype.findOne = function() {
  throw 'Please supply a database adapter.';
};


Base.prototype.insert = function() {
  throw 'Please supply a database adapter.';
};


Base.prototype.update = function() {
  throw 'Please supply a database adapter.';
};


Base.prototype.save = function() {
  throw 'Please supply a database adapter.';
};


Base.prototype.remove = function() {
  throw 'Please supply a database adapter.';
};


Base.prototype.validate = function() {
  throw 'Please supply a database adapter.';
};
