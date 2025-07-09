const express = require('express');
const router = express.Router();
const pool = require('../models/db');

router.get('/', async (req, res) => {
  const [news] = await pool.execute('SELECT * FROM news ORDER BY created_at DESC LIMIT 6');
  const [properties] = await pool.execute('SELECT * FROM properties ORDER BY created_at DESC LIMIT 6');
  const [renovations] = await pool.execute('SELECT * FROM renovations ORDER BY created_at DESC LIMIT 6');

  res.render('home', { news, properties, renovations });
});

module.exports = router;