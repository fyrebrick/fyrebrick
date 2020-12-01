const schedule = require('node-schedule');
const User = require('../models/user');
const updaters = require('../helpers/update/bricklink');
exports.default = async ()=>{
    const users = await User.find({setUpComplete:true});
    //TODO this doesnot work for multiple users
    console.log('[INFO]: Setting up all schedulers for users');
//    const user = users[0];
    users.forEach(
        (user) => {
            console.log("[INFO]: User "+user.email+" has set updating interval to "+user.update_interval+"min");
            const j = schedule.scheduleJob("*/"+user.update_interval+" * * * *",()=>{
                console.log("[INFO]: Updating models for user "+user.email);
                updateModels(user);
            });
        } 
    );
};

const updateModels = async (user) => {
    updaters.inventoryAll(user);
    updaters.ordersAll(user,"?direction=in&status=pending,updated,processing,ready,paid,packed");
}