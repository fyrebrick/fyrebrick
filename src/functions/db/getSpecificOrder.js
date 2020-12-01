const Order = require('../../models/order');

exports.default = async (orders_total,user,order_id) =>
{
    let order = await Order.findOne({order_id:order_id,consumer_key:user.CONSUMER_KEY});
    if(orders_total){
        order.orders_total = orders_total;
    }
    let orders_checked = 0;
    for(i of order.items ){
        if(i.status){
            orders_checked++;
        }
    }
    order.orders_checked = orders_checked;
    await Order.updateOne({order_id:order_id,consumer_key:user.CONSUMER_KEY},order);
    return order;
}