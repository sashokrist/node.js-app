// controllers/newsController.js
const path = require('path');
const multer = require('multer');
const pool = require('../models/db');

// Image upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/news'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });
exports.uploadNewsImage = upload.single('image');

// List paginated news (3 per page)
exports.index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 3;
  const offset = (page - 1) * perPage;

  const [news] = await pool.execute('SELECT * FROM news ORDER BY id DESC LIMIT ? OFFSET ?', [perPage, offset]);
  const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM news');
  const totalPages = Math.ceil(total / perPage);

  res.render('news/index', { news, currentPage: page, totalPages });
};

// Show create form
exports.showCreateForm = (req, res) => {
  res.render('news/create');
};

// Handle creation
exports.create = async (req, res) => {
  const { title, content } = req.body;
  const imagePath = req.file ? '/uploads/news/' + req.file.filename : null;

  await pool.execute(
    'INSERT INTO news (title, content, image) VALUES (?, ?, ?)',
    [title, content, imagePath]
  );

  res.redirect('/admin/news');
};

// Show edit form
exports.showEditForm = async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM news WHERE id = ?', [req.params.id]);
  const news = rows[0];
  if (!news) return res.status(404).send('News not found');
  res.render('news/edit', { news });
};

// Handle update
exports.update = async (req, res) => {
  const { title, content } = req.body;
  const id = req.params.id;
  await pool.execute('UPDATE news SET title = ?, content = ? WHERE id = ?', [title, content, id]);
  res.redirect('/admin/news');
};

// Handle delete
exports.delete = async (req, res) => {
  const id = req.params.id;
  await pool.execute('DELETE FROM news WHERE id = ?', [id]);
  res.redirect('/admin/news');
};

// Show single news item
exports.show = async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM news WHERE id = ?', [req.params.id]);
  const item = rows[0];
  if (!item) return res.status(404).send('News not found');
  res.render('news/show', { item });
};