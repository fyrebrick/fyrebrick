const router = require('express').Router();
const {inventory} = require('../../controllers/my/inventory');
router.get('/',inventory.index.get);
router.get('/add',inventory.add.get);
router.get('/search',inventory.search.get);
router.get('/investigate',inventory.investigate.get);
router.post('/search',inventory.search.post);
router.post('/update/new_or_used',inventory.update.new_or_used);
router.post('/update/remarks',inventory.update.remarks);
router.post('/update/quantity',inventory.update.quantity);
    
module.exports = router;