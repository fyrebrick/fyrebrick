const mongoose = require('mongoose');


const Inventory = new mongoose.Schema({
    CONSUMER_KEY:String,
    inventory_id:Number,
    item: {
        no:String,
        name:String,
        type:String,
        category_id:Number,    
    },
    color_id:Number,
    color_name:String,
    quantity:Number,
    new_or_used:String,
    completeness:String,
    unit_price:String,
    bind_id:Number,
    description:String,
    remarks:String,
    bulk:Number,
    is_retain:Boolean,
    is_stock_room:Boolean,
    stock_room_id:String,
    date_created:Date,
    my_cost:String,
    sale_rate:Number,
    tier_quantity1:Number,
    tier_quantity2:Number,
    tier_quantity3:Number,
    tier_price1:String,
    tier_price2:String,
    tier_price3:String,
    my_weight:String
},
{ typeKey: '$type' });

const inventory = mongoose.model('Inventory',Inventory);
module.exports = inventory;