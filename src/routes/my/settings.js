const router = require('express').Router();
const settings = require('../../controllers/my/settings');

router.get('/',settings.index);
router.put('/bricklinkApi',settings.bricklinkApi.put);
router.put('/inventoryInterval',settings.inventoryInterval.put);
//router.get('/update/orders',settings.update.orders); // disabled
router.get('/fix/duplicates',settings.fix.duplicates);
//router.get('/update/inventory',settings.update.inventory); //disabled
router.put('/callback',settings.callbackCheckbox.put);
module.exports = router;