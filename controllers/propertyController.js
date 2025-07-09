const pool = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage config for image uploads
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
exports.uploadImages = upload.array('images', 10); // max 10 files

// List all properties
exports.index = async (req, res) => {
  const [properties] = await pool.execute('SELECT * FROM properties ORDER BY id DESC');
  res.render('properties/index', { properties });
};

// Show single property details
exports.showProperty = async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM properties WHERE id = ?', [req.params.id]);
  const property = rows[0];

  if (!property) return res.status(404).send('Property not found');

  property.images = property.image_url ? property.image_url.split(',') : [];
  const [features] = await pool.execute('SELECT feature FROM property_features WHERE property_id = ?', [property.id]);
  property.features = features.map(f => f.feature);

  res.render('properties/show', { property });
};

// Show form to create a property
exports.showCreateForm = (req, res) => {
  res.render('properties/create');
};

// Create a new property
exports.create = async (req, res) => {
  const {
    title, description, price, location,
    size, year_built, bedrooms, bathrooms, features
  } = req.body;

  const imagePaths = req.files.map(file => '/uploads/properties/' + file.filename);
  const image_url = imagePaths.join(',');

  const [result] = await pool.execute(
    `INSERT INTO properties (title, description, price, location, size, year_built, image_url, bedrooms, bathrooms)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description, price, location, size, year_built, image_url, bedrooms, bathrooms]
  );

  const propertyId = result.insertId;

  if (features) {
    const featureList = features.split(',').map(f => f.trim()).filter(Boolean);
    for (const feature of featureList) {
      await pool.execute('INSERT INTO property_features (property_id, feature) VALUES (?, ?)', [propertyId, feature]);
    }
  }

  res.redirect('/admin/properties');
};

// Show edit form
exports.showEditForm = async (req, res) => {
  const [[property]] = await pool.execute('SELECT * FROM properties WHERE id = ?', [req.params.id]);
  const [featuresRows] = await pool.execute('SELECT feature FROM property_features WHERE property_id = ?', [req.params.id]);
  property.features = featuresRows.map(f => f.feature);
  res.render('properties/edit', { property });
};

// Update existing property
exports.update = async (req, res) => {
  const {
    title, description, price, location,
    size, year_built, bedrooms, bathrooms, features
  } = req.body;

  const id = req.params.id;

  try {
    // Update base fields
    await pool.execute(
      `UPDATE properties SET title=?, description=?, price=?, location=?, size=?, year_built=?, bedrooms=?, bathrooms=?
       WHERE id=?`,
      [title, description, price, location, size, year_built, bedrooms, bathrooms, id]
    );

    // Replace images if new ones are uploaded
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(file => '/uploads/properties/' + file.filename);
      const image_url = newImagePaths.join(',');
      await pool.execute('UPDATE properties SET image_url = ? WHERE id = ?', [image_url, id]);
    }

    // Replace features
    await pool.execute('DELETE FROM property_features WHERE property_id = ?', [id]);

    if (features) {
      const featureList = features.split(',').map(f => f.trim()).filter(Boolean);
      for (const feature of featureList) {
        await pool.execute('INSERT INTO property_features (property_id, feature) VALUES (?, ?)', [id, feature]);
      }
    }

    res.redirect('/admin/properties');
  } catch (err) {
    console.error('Property update failed:', err);
    res.status(500).send('Update failed');
  }
};

// Delete property
exports.delete = async (req, res) => {
  const id = req.params.id;

  // Features will be deleted if ON DELETE CASCADE is set
  await pool.execute('DELETE FROM properties WHERE id = ?', [id]);

  res.redirect('/admin/properties');
};