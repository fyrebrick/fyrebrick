const redis = require('redis');
const session = require('express-session');
const store = require('connect-redis')(session);

const {vars} = require('../helpers/constants/vars');
const {logger} = require("fyrebrick-helper").helpers;

const client = redis.createClient(vars.redis.port,vars.redis.host);
const redisStore = new store({
    host: process.env.DEVELOP_REDIS_HOST,
    port: process.env.REDIS_PORT,
    client: client,
    prefix:'session',
    ttl: 1209600
          
});

client.on('connect',()=>{
    logger.info(`redis database connect on ${vars.redis.host}:${vars.redis.port}`);
});

client.on('error',(error)=>{
    logger.info(`redis error: ${error}`);
});

if(vars.fyrebrick.develop){
    client.on('monitor',(time,args,rawReply)=>{
        logger.info(`${time}: args`)
    })
}

module.exports = 
{
    client,
    redisStore
};