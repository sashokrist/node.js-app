const express = require('express');
const router = express.Router();
const renovationController = require('../controllers/renovationController');

router.get('/', renovationController.index);
router.get('/create', renovationController.showCreateForm);
router.post('/create', renovationController.uploadRenovationImage, renovationController.create);
router.get('/edit/:id', renovationController.showEditForm);
router.post('/edit/:id', renovationController.uploadRenovationImage, renovationController.update);
router.post('/delete/:id', renovationController.delete);

module.exports = router;