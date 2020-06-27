var express = require('express');
var router = express.Router();
var Order = require('../models/order');
const User = require('../models/user');
//gives the specific order from the db
router.get('/order/:order_id',async (req,res,next)=>{
    //find the order, if not found create a new order
    let user = await User.findOne({_id:req.session._id});
    let order = await Order.findOne({order_id:req.params.order_id,consumer_key:user.CONSUMER_KEY});
    res.setHeader('Content-Type', 'application/json');
    if(order==null){
        let newOrderJson = {
            order_id:req.params.order_id,
            consumer_key:user.CONSUMER_KEY,
            items:[],
            description:""
        };
        let newOrder = new Order(newOrderJson);
        newOrder.save();
        res.send(newOrder);
    }else{
        res.send(order);
    }
});

//updates a specific order from the db
//body properties can be:
//item: [string (inventory_id)] (this will change its boolean value, if not exists will create it)
//description: [String]
router.put('/order/:order_id',async (req,res,next)=>{
    let user = await User.findOne({_id:req.session._id});
    let order = await Order.findOne({order_id:req.params.order_id,consumer_key:user.CONSUMER_KEY});
    if(req.body.item){
        let index = 0;
        let found = false;
        for(const _i of order.items){
            if(req.body.item==_i.id){
                order.items[index].status = !order.items[index].status;
                found = true;
            }
            index++;
        }
        if(!found){
            order.items.push({id:req.body.item,status:true});
            await order.updateOne({order_id:req.params.order_id,consumer_key:user.CONSUMER_KEY},order);
        }
    }
    if(req.body.description){
        order.description = req.body.description;
    }
    //update the order
    await Order.updateOne({order_id:req.params.order_id,consumer_key:user.CONSUMER_KEY},order);
    res.setHeader('Content-Type', 'application/json');
    res.send({meta:"EMTPY_JSON",data:[]});
});

module.exports = router;