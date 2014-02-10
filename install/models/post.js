var Base = require('./base');

/**
 * Expose `Post` Model
 */
module.exports = Post;



/**
 * Post model constructor.
 * @param {express.app} app Express App instance.
 * @param {Object=} resource Optional resource.
 * @constructor
 * @extends {app.models.base}
 */
function Post(app, resource) {
  this.app = app;
  this.resource = resource || null;
  this.db = app.db;

  /**
   * Table name.
   * @const
   * @private {string}
   */
  this.TABLE_ = 'post';

  /**
   * Table strucure.
   * @private
   * @enum {string}
   */
  this.STRUCTURE_ = {
    id: {type: Number, required: false},
    user_id: {type: Number, length: 10, required: true},
    title: {type: String, length: 255, required: true},
    slug: {type: String, length: 255, required: true},
    description: {type: 'Text', required: true},
    description_md: {type: 'Text', required: true},
    body: {type: 'Text', required: true},
    body_md: {type: 'Text', required: true},
    created: {type: Number, required: true, default: 'NOW()'},
    updated: {type: Number, required: true, default: 'NOW()'}
  };

  /**
   * MySQL Query Strings.
   * @private
   * @enum {string}
   */
  this.QUERIES_ = {
    find: 'SELECT * FROM `post` WHERE ?',
    findOne: 'SELECT * FROM `post` WHERE ? LIMIT 1',
    insert: 'INSERT INTO post SET ?'
  };

  Base.call(this);
}
require('util').inherits(Post, Base);
