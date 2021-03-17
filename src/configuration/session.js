const redis = require('redis');
const session = require('express-session');
const store = require('connect-redis')(session);
const {logger} = require("fyrebrick-helper").helpers;
const client = redis.createClient(process.env.REDIS_URI.split(":")[1],process.env.REDIS_URI.split(":")[0]);
const redisStore = new store({
    host: process.env.REDIS_URI.split(":")[0],
    port: process.env.REDIS_URI.split(":")[1],
    client: client,
    prefix:'session',
    ttl: 1209600
          
});

client.on('connect',()=>{
    logger.info(`redis database connect on ${process.env.REDIS_URI}`);
});

client.on('error',(error)=>{
    logger.info(`redis error: ${error}`);
});

if(process.env.DEVELOPMENT){
    client.on('monitor',(time,args,rawReply)=>{
        logger.info(`${time}: args`)
    })
}

module.exports = 
{
    client,
    redisStore
};