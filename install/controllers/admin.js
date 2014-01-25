exports.index = function(req, res) {
  res.render('main/index', {title: 'Admin Home', posts: posts});
};