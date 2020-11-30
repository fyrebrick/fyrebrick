const express = require('express');
const router = express.Router();
const itemRoutes = require('./item');
const itemsRoutes = require('./itemsRoutes');

router.use('/item',itemRoutes);
router.use('/items',itemsRoutes);

module.exports = router;