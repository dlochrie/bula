var Post = require('../models/post');

exports.index = function(req, res) {
  var post = new Post(req.app);
  post.find(function(err, results) {
    if (err || !results) {
      req.flash('error', 'There was an error getting the posts: ' + err);
      res.redirect('/');
    } else {
      res.render('main/index', {
        title: 'Home',
        results: results
      });
    }
  });
};


exports.about = function(req, res) {
  res.render('main/about', {title: 'About'});
};


exports.contact = function(req, res) {
  res.render('main/contact', {title: 'Contact'});
};


exports.login = function(req, res) {
  res.render('main/login', {title: 'Login'});
};
