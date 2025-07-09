exports.getDashboard = (req, res) => {
  res.render('index', { user: req.session.user });
};
