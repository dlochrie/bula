var Post = require('../models/post');


exports.index = function(req, res) {
  var post = new Post(req.app, null);
  post.find(null, function(err, posts) {
    if (err) {
      // TODO: Bad way of handling error. Should flash...
      res.send('There was an error getting posts', err);
    } else {
      console.log(posts);
      res.render('posts/index', {
        description: 'Browse the Latest Posts.',
        posts: posts,
        title: 'Blog Posts'
      });
    }
  });
};
