/**
 * All routes for /my path
 */
const router = require('express').Router();
const routes = {
    orders:require('./my/orders'),
    inventory:require('./my/inventory'),
    settings:require('./my/settings'),
    gdpr:require('./my/gdpr'),
    api:require("./my/api"),
    charts:require("./my/charts")
}
const controllers = {
    dashboard:require('../controllers/my/index')
}

router.get('/',controllers.dashboard.redirectToMe);
router.use('/api',routes.api);
router.get('/dashboard',controllers.dashboard.dashboard);
router.use('/orders',routes.orders);
router.use('/inventory',routes.inventory);
router.use('/settings',routes.settings);
router.use('/gdpr',routes.gdpr);
router.use('/charts',routes.charts);

module.exports = router;