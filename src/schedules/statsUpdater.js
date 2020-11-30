let schedule = require('node-schedule');
const Stats = require('../models/stats');
const User = require('../models/user');
const getStats = require('../functions/bricklink/getStats');
const getStores = require('../functions/bricklink/getStores');
const Stores = require('../models/stores');
exports.default = async ()=>{

    let every_minute = '* * * * * ';
    let every_day_once = '50 23 * * *';
    let every_hour_once = '0 * * * *';

    schedule.scheduleJob(every_hour_once,async()=>{
        console.log('[INFO]: running stats job...');
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
    });
    schedule.scheduleJob(every_day_once,async()=> {
        console.log('[INFO]: running getStores job');
        let data = await getStores.default().catch((err)=>{
            console.trace(err);
        }).then((data) => {
            return data
        });
        let store = await Stores.findOne({});
        if(store){
            await Stores.updateOne({},{main:data});
        }else{
            let saveme = new Stores({main:data});
            saveme.save();
        }

        //new_used_bricks stats
        //let data_2 = await getStores.
     }
    )
};
