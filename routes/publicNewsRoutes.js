const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Show list of news
router.get('/', newsController.index);

// Show form to create news
router.get('/create', newsController.showCreateForm);

// Handle create form submission
router.post('/create', newsController.uploadNewsImage, newsController.create);
router.get('/:id', newsController.show); // 👈 this must come after the `/create` route
module.exports = router;