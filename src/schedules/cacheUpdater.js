const schedule = require('node-schedule');
const {bricklink_make_cache} = require('../middlewares/redis');
const User = require('../models/user');

exports.default = async ()=>{
    const every_3_minutes = "*/3 * * * *";
    schedule.scheduleJob(every_3_minutes,async ()=>{
        console.log("getting users inventory cache...");
        const users = await User.find({setUpComplete:true});
        users.forEach((user)=>{
            bricklink_make_cache(user,"/inventories");
        });
    })
};