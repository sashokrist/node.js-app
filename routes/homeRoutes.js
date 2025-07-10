const express = require('express');
const router = express.Router();
const pool = require('../models/db');

router.get('/', async (req, res) => {
  const newsPage = parseInt(req.query.newsPage) || 1;
  const propertyPage = parseInt(req.query.propertyPage) || 1;

  const newsLimit = 6;
  const propLimit = 6;

  const newsOffset = (newsPage - 1) * newsLimit;
  const propOffset = (propertyPage - 1) * propLimit;

  const [news] = await pool.execute('SELECT * FROM news ORDER BY id DESC LIMIT ? OFFSET ?', [newsLimit, newsOffset]);
  const [[{ count: newsCount }]] = await pool.execute('SELECT COUNT(*) AS count FROM news');

  const [properties] = await pool.execute('SELECT * FROM properties ORDER BY id DESC LIMIT ? OFFSET ?', [propLimit, propOffset]);
  const [[{ count: propertyCount }]] = await pool.execute('SELECT COUNT(*) AS count FROM properties');

  const [renovations] = await pool.execute('SELECT * FROM renovations ORDER BY id DESC LIMIT 6');

  res.render('home', {
    news,
    properties,
    renovations,
    newsPage,
    propertyPage,
    newsTotalPages: Math.ceil(newsCount / newsLimit),
    propertyTotalPages: Math.ceil(propertyCount / propLimit)
  });
});

module.exports = router;