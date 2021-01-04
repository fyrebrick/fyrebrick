const router = require('express').Router();
const callback = require('../controllers/callback');
router.post('/:username/',callback);

module.exports = router;