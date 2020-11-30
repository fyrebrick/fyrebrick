const Stats = require('../../models/stats');
const getStats = require('../bricklink/getStats');
exports.default = async (user) => {
    let stats =await Stats.findOne({consumer_key:user.CONSUMER_KEY});
    if(!stats){
        let data = await getStats.default(user).then((data)=>{return data});
        let new_stats = Stats({
            total_bricks:data.total_bricks,
            total_unique_bricks:data.total_unique_bricks,
            most_common_bricks:data.most_common_bricks,
            most_common_brick_colours:[data.most_common_brick_colours],
            consumer_key:user.CONSUMER_KEY
        });
        new_stats.save();
    }
    return stats;
}