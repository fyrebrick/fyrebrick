var express = require('express');
var router = express.Router();
const Order = require('../../models/order');

router.get('/new',async(req,res)=>{
    const orders = await Order.find({consumer_key:req.session.user.CONSUMER_KEY,$or:[{
        status:"PENDING",
        status:"UPDATED",
        status:"PROCESSING",
        status:"READY",
        status:"PAID",
        status:"PACKED"
      }]});
    res.render('orderList',{active:'orders',data:{orders:orders}});
});

router.get('/all',async(req,res,next)=>{
    const orders = await Order.find({consumer_key:req.session.user.CONSUMER_KEY});
    res.setHeader('Content-Type', 'application/json');  
    res.send(orders);
});


router.get('/:order_id/items',async (req,res)=>{
    const order = await Order.findOne({order_id:req.params.order_id});
    res.render('order',{
       'order_id':req.params.order_id,
       active:"orders",
       order:order
    })
 });



module.exports = router;
