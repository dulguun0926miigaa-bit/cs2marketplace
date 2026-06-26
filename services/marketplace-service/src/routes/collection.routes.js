const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');
const { fromGateway } = require('../middleware/auth.middleware');

router.use(fromGateway);
router.get('/', collectionController.getAll);
router.get('/:slug', collectionController.getBySlug);

module.exports = router;
