const router = require('express').Router();
const {logger} = require('../../configuration/logger');
const controllers = {
    orders: require('../../controllers/my/orders')
}

router.get('/',controllers.orders.index);
router.get('/db',async(req,res,next)=>{
    logger.debug(`received db get request`);
    const {ordersAll} = require('../../helpers/bricklink/bricklink');
    const user = await (require('../../models/user')).findOne({_id:req.session._id})
    logger.debug(`user : ${user.email}`);
    ordersAll(user);
    res.send('updating orders...');
})
router.get('/:order_id',controllers.orders.order_id);

router.put('/:order_id',controllers.orders.put);

module.exports = router;