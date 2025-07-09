const pool = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads/renovations';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Middleware for single image upload
exports.uploadRenovationImage = upload.single('image');

// Show list of renovations
exports.index = async (req, res) => {
  const [renovations] = await pool.execute('SELECT * FROM renovations ORDER BY id DESC');
  res.render('renovations/index', { renovations });
};

// Show create form
exports.showCreateForm = (req, res) => {
  res.render('renovations/create');
};

// Create a renovation service
exports.create = async (req, res) => {
  const { service_name, description } = req.body;

  // Safe image path (null if no file uploaded)
  const imagePath = req.file && req.file.filename
    ? '/uploads/renovations/' + req.file.filename
    : null;

  // Optional debug log (remove in production)
  console.log({ service_name, description, imagePath });

  try {
    await pool.execute(
      'INSERT INTO renovations (service_name, description, image_url) VALUES (?, ?, ?)',
      [service_name, description, imagePath]
    );
    res.redirect('/admin/renovations');
  } catch (err) {
    console.error('Database insert error:', err);
    res.status(500).send('Server Error');
  }
};