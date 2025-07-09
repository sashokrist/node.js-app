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

// List renovations and renovating_services
exports.index = async (req, res) => {
  try {
    const [renovations] = await pool.execute('SELECT * FROM renovations ORDER BY id DESC');
    const [renovatingServices] = await pool.execute('SELECT * FROM renovating_services ORDER BY id DESC');
    res.render('renovations/index', { renovations, renovatingServices });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Server Error');
  }
};

// Show create form
exports.showCreateForm = (req, res) => {
  res.render('renovations/create');
};

// Create renovation and renovating_service
exports.create = async (req, res) => {
  const { service_name, description, service_type } = req.body;
  const image_name = req.file?.originalname || null;
  const image_url = req.file ? '/uploads/renovations/' + req.file.filename : null;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insert into renovations
    await conn.execute(
      'INSERT INTO renovations (service_name, description, image_url) VALUES (?, ?, ?)',
      [service_name, description, image_url]
    );

    // Insert into renovating_services
    await conn.execute(
      'INSERT INTO renovating_services (title, image_name, description, image_url, service_type) VALUES (?, ?, ?, ?, ?)',
      [service_name, image_name, description, image_url, service_type]
    );

    await conn.commit();
    res.redirect('/admin/renovations');
  } catch (err) {
    await conn.rollback();
    console.error('Transaction failed:', err);
    res.status(500).send('Insert Failed');
  } finally {
    conn.release();
  }
};

// Show edit form
exports.showEditForm = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM renovations WHERE id = ?', [req.params.id]);
    const renovation = rows[0];
    if (!renovation) return res.status(404).send('Renovation not found');
    res.render('renovations/edit', { renovation });
  } catch (err) {
    console.error('Fetch for edit failed:', err);
    res.status(500).send('Server Error');
  }
};

// Update renovation
exports.update = async (req, res) => {
  const { service_name, description, existing_image } = req.body;
  const id = req.params.id;
  const image_url = req.file ? '/uploads/renovations/' + req.file.filename : existing_image;

  try {
    await pool.execute(
      'UPDATE renovations SET service_name = ?, description = ?, image_url = ? WHERE id = ?',
      [service_name, description, image_url, id]
    );
    res.redirect('/admin/renovations');
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).send('Update Failed');
  }
};

// Delete renovation
exports.delete = async (req, res) => {
  try {
    await pool.execute('DELETE FROM renovations WHERE id = ?', [req.params.id]);
    res.redirect('/admin/renovations');
  } catch (err) {
    console.error('Delete failed:', err);
    res.status(500).send('Delete Failed');
  }
};