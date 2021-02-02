/**
 * routes for /callback path
 */
const router = require('express').Router();

const controllers = require('../controllers/callback');

router.post('/:username/',controllers.callback);

module.exports = router;