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

router.get('/edit/:id', newsController.showEditForm);
router.post('/edit/:id', newsController.update);
router.post('/delete/:id', newsController.delete);

module.exports = router;