const schedule = require('node-schedule');
const User = require('../models/user');
const bricklink = require('../helpers/bricklink/bricklink');
const {logger} = require('./src/configuration/logger');

exports.default = async ()=>{
    const users = await User.find({setUpComplete:true});
    //TODO this does not work for multiple users (check if it does)
    logger.info(`Setting up all schedulers for users`);
//    const user = users[0];
    users.forEach(
        (user) => {
            logger.info(`User ${user.email} has set updating interval to ${user.update_interval} min`);
            const j = schedule.scheduleJob("*/"+user.update_interval+" * * * *",()=>{
                logger.info(`Updating models for user ${user.email}`);
                updateModels(user);
            });
        } 
    );
};

const updateModels = async (user) => {
    bricklink.inventoryAll(user);
    bricklink.ordersAll(user,"?direction=in&status=pending,updated,processing,ready,paid,packed");
}