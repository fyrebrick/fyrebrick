const router = require('express').Router();
const gdpr = require('../../controllers/my/gdpr');

router.use('/download',gdpr.download);
router.use('/remove',gdpr.remove);
module.exports = router;