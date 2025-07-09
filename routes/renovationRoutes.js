const express = require('express');
const router = express.Router();
const renovationController = require('../controllers/renovationController');

router.get('/', renovationController.index);
router.get('/create', renovationController.showCreateForm);
// router.post('/create', renovationController.create);

router.post('/create', renovationController.uploadRenovationImage, renovationController.create);

module.exports = router;
