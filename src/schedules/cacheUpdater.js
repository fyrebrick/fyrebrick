const schedule = require('node-schedule');
const {BL_make} = require('../middlewares/redis');
const User = require('../models/user');

//cache updater jobs
exports.default = async ()=>{
    const every_3_minutes = "*/3 * * * *";
    //get the inventory of each user and put it in cache
    schedule.scheduleJob(every_3_minutes,async ()=>{
        console.log('[INFO]: running update inventory job...');
        const users = await User.find({setUpComplete:true}); //Only get users that have their setup complete
        users.forEach((user)=>{
            BL_make(user,"/plus/inventories/items/search",'/inventories');
        });
    })
};