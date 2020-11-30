const mongoose = require('mongoose');

const Stats = new mongoose.Schema({
    total_bricks:[Number],
    new_used_bricks:{
        current_amount_used:Number,
        current_amount_new:Number,
        total_amount_new_sold:Number,
        total_amount_used_sold:Number,
        daily_stats:[{
           used_sold:Number,
           new_sold:Number,
           used_added:Number,
           new_added:Number,
        }],
    },
    total_unique_bricks:[Number],
    most_common_bricks:[[Number]],
    most_common_brick_colours:[[{
            color_name:String,
            quantity:Number
    }]],
        consumer_key:{
            required:true,
            type:String
        },
    },
);

const stats = mongoose.model('Stats', Stats);


module.exports = stats;

