const schedule = require('node-schedule');
const {BL_make} = require('../middlewares/redis');
const User = require('../models/user');

exports.default = async ()=>{
    const every_3_minutes = "*/3 * * * *";
    schedule.scheduleJob(every_3_minutes,async ()=>{
        console.log('[INFO]: running update inventory job...');
        //console.log("getting users inventory cache...");
        const users = await User.find({setUpComplete:true});
        users.forEach((user)=>{
            BL_make(user,"/plus/inventories/items/search",'/inventories');
        });
    })
};