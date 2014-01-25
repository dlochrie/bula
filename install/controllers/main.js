exports.index = function(req, res) {
  res.render('main/index', {title: 'Home'});
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