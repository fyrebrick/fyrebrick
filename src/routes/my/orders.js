const router = require('express').Router();
const controllers = {
    orders: require('../../controllers/my/orders')
}

router.get('/',controllers.orders.index);

router.get('/all',controllers.orders.all);

router.get('/:order_id',controllers.orders.order_id);

router.put('/:order_id',controllers.orders.put);

router.post('/removeDuplicates',controllers.orders.removeDuplicates);

module.exports = router;