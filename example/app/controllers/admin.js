exports.index = function(req, res) {
  res.render('main/index', {title: 'The Blog Redefined', posts: posts});
};


exports.about = function(req, res) {
  res.render('main/about', {title: 'About'});
};


exports.contact = function(req, res) {
  res.render('main/contact', {title: 'Contact'});
};