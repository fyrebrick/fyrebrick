const mongoose = require('mongoose');
const {logger} = require("fyrebrick-helper").helpers;
const start = async () => {
    try {
        mongoose.connect(process.env.MONGO_DB_URI, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        mongoose.connection.on('open', () => {
            logger.info(`mongodb connection opened at ${process.env.MONGO_DB_URI}`);
        });
        mongoose.connection.on('close', () => {
            logger.warn(`mongodb connection opened at ${process.env.MONGO_DB_URI}`);
        });
        mongoose.connection.on('error',(err)=>{
            logger.error(`MongoDB gave an error ${err}`);
            logger.debug(`retrying connection...`);
            mongoose.connect(process.env.MONGO_DB_URI, {
                useCreateIndex: true,
                useUnifiedTopology: true,
                useNewUrlParser: true
            });
        })
    } catch (e) {
        logger.error(`caught err: ${e}`);
        process.exit(1);
    }
};

module.exports = 
{
    start
};