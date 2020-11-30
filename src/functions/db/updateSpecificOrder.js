const Order = require('../../models/order');

exports.default = async (order,user,body_item,order_id,description) => {
    if(body_item){
        let index = 0;
        let found = false;
        let orders_checked = 0;
        for(const _i of order.items){
            if(body_item==_i.id){
                order.items[index].status = !order.items[index].status;
                found = true;
            }
            if(_i.status){
                orders_checked++;
            }
            index++;
        }
        order.orders_checked = orders_checked;
        if(!found){
            order.items.push({id:body_item,status:true});
            order.orders_checked++;
            await order.updateOne({order_id:order_id,consumer_key:user.CONSUMER_KEY},order);
        }
    }
    if(description){
        order.description = description;
    }
    //update the order
    await Order.updateOne({order_id:order_id,consumer_key:user.CONSUMER_KEY},order);
}