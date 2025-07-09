const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

router.get('/', propertyController.index);
router.get('/create', propertyController.showCreateForm);

router.post('/create', propertyController.uploadImages, propertyController.create);
router.get('/edit/:id', propertyController.showEditForm);
// router.post('/edit/:id', propertyController.update);
router.post('/edit/:id', propertyController.uploadImages, propertyController.update);
router.post('/delete/:id', propertyController.delete);

// Place this last to avoid conflict
router.get('/:id', propertyController.showProperty);

module.exports = router;
