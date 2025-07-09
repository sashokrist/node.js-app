// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../models/db');

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  const [news] = await pool.execute('SELECT * FROM news ORDER BY id DESC LIMIT ? OFFSET ?', [limit, offset]);
  const [[{ count }]] = await pool.execute('SELECT COUNT(*) AS count FROM news');
  const [properties] = await pool.execute('SELECT * FROM properties ORDER BY id DESC LIMIT 3');
  const [renovations] = await pool.execute('SELECT * FROM renovations ORDER BY id DESC LIMIT 3');

  const totalPages = Math.ceil(count / limit);

  res.render('home', {
    news,
    properties,
    renovations,
    page,
    totalPages
  });
});

module.exports = router;