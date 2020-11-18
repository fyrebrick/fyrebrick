var express = require('express');
var router = express.Router();
const Order = require('../../models/order');

router.get('/new',(req,res)=>{
    res.render('orderList',{active:'orders'});
});

router.get('/all',async(req,res,next)=>{
    let orders = await Order.find({consumer_key:user.CONSUMER_KEY});
    res.setHeader('Content-Type', 'application/json');  
    res.send(orders);
});


router.get('/:order_id/items',async (req,res)=>{
    const orderDB = await Order.findOne({order_id:req.params.order_id});
    res.render('order',{
       'order_id':req.params.order_id,
       active:"orders",
       data : {orderDB:orderDB}
    })
 });

router.get('/:status',(req,res)=>{
    res.render('status',{'status':req.params.status.toUpperCase(),active:"orders"});
});


module.exports = router;
