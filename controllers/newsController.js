const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/news'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });
exports.uploadNewsImage = upload.single('image');

const pool = require('../models/db');

exports.index = async (req, res) => {
  const [news] = await pool.execute('SELECT * FROM news ORDER BY id DESC');
  res.render('news/index', { news });
};

exports.showCreateForm = (req, res) => {
  res.render('news/create');
};

exports.create = async (req, res) => {
  const { title, content } = req.body;
  const imagePath = req.file ? '/uploads/news/' + req.file.filename : null;

  await pool.execute(
    'INSERT INTO news (title, content, image) VALUES (?, ?, ?)',
    [title, content, imagePath]
  );

  res.redirect('/admin/news');
};
