const mongoose = require('mongoose');

const Order = new mongoose.Schema({
        order_id:{
            required:true,
            type:Number
        },
        items:[
            {
                id:{
                    type:Number
                },
                status:{
                    default:false,
                    type:Boolean
                }
            }
        ],
        consumer_key:{
            required:true,
            type:String
        },
        description:{
            default:"",
            type:String
        },
        orders_checked:{
            type:Number,
            default:0
        },
        orders_total:{
            type:Number
        }
    },
);

const order = mongoose.model('Order', Order);


module.exports = order;

