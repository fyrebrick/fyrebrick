const Order = require('../../models/order');
const {logger} = require('../../configuration/logger');
const Inventory = require('../../models/inventory');
const frontend = require('../../frontend/orderList');
const {getColorInlineStyle} = require('../../frontend/color');
const {getImageSrcFromItem} = require('../../frontend/image');

const orders = {
    index: async (req,res,next) => {
        const orders = await Order.find({$and: [{consumer_key:req.session.user.CONSUMER_KEY},{$or:[{status:"PENDING"},{status:"UPDATED"},{status:"PROCESSING"},{status:"READY"},{status:"PAID"},{status:"PACKED"}]}]});
        res.render('orderList',{
            orders:orders,
            fn:frontend
        })  
    },
    order_id: async (req,res,next) => {
        const order = await Order.findOne({order_id:req.params.order_id});
        if(!order){
            logger.error(`Order id ${req.params.order_id} not found`);
            res.status(404).render('error',{
                status:'404 Not found',
                message:'we could not find this order id'
            })
        }
        const stock = [];
        let totalItems = 0;
        order.items.forEach((batch)=>{
            totalItems+=batch.length;
        })
        logger.debug(`iterating ${totalItems} items in order ${order.order_id}`);
        order.items.forEach(batch=>{
            batch.forEach(async item=>{
                const inventory = await Inventory.findOne({CONSUMER_KEY:req.session.user.CONSUMER_KEY, inventory_id:item.inventory_id});
                let qty = 0;
                if(inventory){
                    logger.debug(`Current inventory id ${item.inventory_id} found, qty : ${inventory.quantity}`);
                    qty = inventory.quantity;
                }else{
                    logger.debug(`Current inventory id ${item.inventory_id} not found`);
                }
                stock.push({
                    inventory_id:item.inventory_id,
                    qty:qty
                })
                if(stock.length===totalItems){
                    render()
                }
            })
        })
        const render = ()=>{
            res.render('order',{
                order:order,
                stock:stock,
                fn:{
                    getColorInlineStyle,
                    getImageSrcFromItem,
                    orderifyRemarks:frontend.orderifyRemarks,
                    render_progress:frontend.render_progress
                },
                frontend:{
                    render_progress:frontend.render_progress,
                    order:order
                }
            });
        }
    },
    put: async (req,res,next)=>{
        const item_id = req.body.inventory_id
        const order_id = req.params.order_id
        const order = await Order.findOne({consumer_key:req.session.user.CONSUMER_KEY,order_id:order_id})
        let value = {
            success:false,
            message:'No message was found'
        }
        if(!order){
            logger.error(`Order id ${order_id} was not found for user ${req.session.user.email}`);
            value.message='order id was not found';
            res.status(404).send(value);
            return;
        }
        order.items.forEach((batch)=>{
            batch.forEach(async(item)=>{
                if(item.inventory_id==item_id){
                    if(item.isChecked){
                        order.orders_checked--;
                    }else{
                        order.orders_checked++;
                    }
                    item.isChecked = !item.isChecked;
                    await Order.updateOne({consumer_key:req.session.user.CONSUMER_KEY,order_id:order_id},order,(err)=>{
                        if(err){
                            logger.error(`user ${req.session.user.email} tried updating checkbox of item ${item_id} in order ${order_id}`);
                            logger.error(`error message: ${err.message}`);
                            value.message = 'updating the item gave an error';
                            res.status(500).send(value);
                            return;
                        }else{
                            value.message = "item was successfully changed";
                            value.success = true;
                            value['order'] = order;
                            res.status(200).send(value);
                            return;
                        }
                    });
                }
            })
        })
    }
}

module.exports = orders;