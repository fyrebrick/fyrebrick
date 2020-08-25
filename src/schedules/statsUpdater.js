let schedule = require('node-schedule');
const Stats = require('../models/stats');
const User = require('../models/user');
const getStats = require('../functions/bricklink/getStats');
exports.default = ()=>{
    let cron_value = '59 23 * * *';
    schedule.scheduleJob('0 * * * *',async()=>{
        let all_stats = await Stats.find();
        for (const stats of all_stats) {
            let user = await User.findOne({CONSUMER_KEY: stats.consumer_key});
            let data = await getStats.default(user).then((data)=>{return data});
            stats.total_bricks.push(data.total_bricks);
            stats.most_common_brick_colours.push(data.most_common_brick_colours);
            stats.total_unique_bricks.push(data.total_unique_bricks);
            Stats.updateOne({consumer_key:stats.consumer_key},{
                total_bricks:stats.total_bricks,
                most_common_brick_colours:stats.most_common_brick_colours,
                total_unique_bricks:stats.total_unique_bricks,
            },((err)=>{
                if(err){
                    console.trace(err);
                }
            }));
        }
    })
};

