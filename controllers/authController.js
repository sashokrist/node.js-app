const pool = require('../models/db');

exports.showLogin = (req, res) => {
  res.render('login');
};

exports.handleLogin = async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  if (rows.length > 0) {
    req.session.user = rows[0];
    res.redirect('/');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
};
