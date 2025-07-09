const pool = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for handling multiple images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads/properties';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });
exports.uploadImages = upload.array('images', 10); // up to 10 images

exports.index = async (req, res) => {
  const [properties] = await pool.execute('SELECT * FROM properties ORDER BY id DESC');
  res.render('properties/index', { properties });
};

exports.showCreateForm = (req, res) => {
  res.render('properties/create');
};

exports.create = async (req, res) => {
  const {
    title, description, price, location,
    size, year_built, bedrooms, bathrooms
  } = req.body;

  const imagePaths = req.files.map(file => '/uploads/properties/' + file.filename);
  const image_url = imagePaths.join(','); // store as comma-separated string

  await pool.execute(
    'INSERT INTO properties (title, description, price, location, size, year_built, image_url, bedrooms, bathrooms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, description, price, location, size, year_built, image_url, bedrooms, bathrooms]
  );

  res.redirect('/admin/properties');
};

exports.showProperty = async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM properties WHERE id = ?', [req.params.id]);
  const property = rows[0];

  if (!property) return res.status(404).send('Property not found');

  property.images = property.image_url ? property.image_url.split(',') : [];
  res.render('properties/show', { property });
};

