const router = require('express').Router();
const settings = require('../../controllers/my/settings');

router.get('/',settings.index);
router.put('/bricklinkApi',settings.bricklinkApi.put);
router.put('/inventoryInterval',settings.inventoryInterval.put);
module.exports = router;