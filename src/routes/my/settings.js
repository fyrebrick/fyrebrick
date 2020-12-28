const router = require('express').Router();
const settings = require('../../controllers/my/settings');

router.get('/',settings.index);

module.exports = router;