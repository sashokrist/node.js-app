const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

router.get('/', propertyController.index);
router.get('/create', propertyController.showCreateForm);

router.post('/create', propertyController.uploadImages, propertyController.create);

router.get('/:id', propertyController.showProperty);

module.exports = router;
