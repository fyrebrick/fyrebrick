const router = require('express').Router();
const routes = {
    orders:require('./my/orders'),
    inventory:require('./my/inventory'),
    settings:require('./my/settings')
}
const controllers = {
    dashboard:require('../controllers/my/index')
}

router.get('/',controllers.dashboard.redirectToMe);
router.get('/dashboard',controllers.dashboard.dashboard);
router.use('/orders',routes.orders);
router.use('/inventory',routes.inventory);
router.use('/settings',routes.settings);
module.exports = router;