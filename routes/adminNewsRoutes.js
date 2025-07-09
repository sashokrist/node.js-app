// routes/adminNewsRoutes.js

const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// List all news
router.get('/', newsController.index);

// Show create form
router.get('/create', newsController.showCreateForm);

// Handle form submission
router.post('/create', newsController.create);

module.exports = router;