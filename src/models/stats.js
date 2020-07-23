const mongoose = require('mongoose');

const Stats = new mongoose.Schema({
    total_bricks:[Number],
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

