const router = require('express').Router();
const controllers = {
    orders: require('../../controllers/my/orders')
}

router.get('/',controllers.orders.index);

router.get('/all',controllers.orders.all);

router.get('/:order_id',controllers.orders.order_id);

router.put('/:order_id',controllers.orders.put);

module.exports = router;