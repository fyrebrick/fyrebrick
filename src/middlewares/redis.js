const redis = require('redis');
const session = require('express-session');
const store = require('connect-redis')(session);

/**
 * The cache's IDs are set up like this:
 * For api calls: COSTUMER_KEY:/relative/path/of/api?queries=here
 * only the inventory does not have a query string in the ID
 * 
 * all other cache's ID are not written down yet. 
 */
let redisStore,client;
if(process.env.DEVELOP==='true'){
    client = redis.createClient(process.env.REDIS_PORT,process.env.DEVELOP_REDIS_HOST);
    client.on('connect',(data)=>{
        console.log(data);
        redisStore = new store({
            host: process.env.DEVELOP_REDIS_HOST,
            port: process.env.REDIS_PORT,
            client: client,
            prexis:'session',
            ttl: 259200 });
    });
}else{
    client = redis.createClient(process.env.REDIS_PORT,process.env.PRODUCTION_REDIS_HOST);
    client.on('connect',(data)=>{
    console.log(data);
        redisStore = new store({
            host: process.env.PRODUCTION_REDIS_HOST,
            port: process.env.REDIS_PORT,
            client: client,
            prexis:'session',
            ttl: 259200 
        });
    });
}
client.on('ready', (data)=> {console.log(data)})
client.on('connect', (data)=> {console.log(data)})
client.on('end', (data)=> {console.log(data)})
client.on('drain', (data)=>{ console.log(data)})
client.on('warn', (data)=> {console.log(data)})
//console.log(redis);
//console.log(redisStore);
module.exports.client = client;
module.exports.redisStore = this.redisStore
const OAuth = require('oauth');
const { parse } = require('path');
//const bricklinkPlus = require('bricklink-plus');
const TTL = 4 * 60;

const getCache = async (req) => {
    return new Promise(async (resolve,reject) =>{
        console.log("GET:"+getID(req));
        await client.get(getId(req), (err,reply)=>{
            if(err){
                console.trace(err.message);
                reject(err);
            }
            if(reply===null){
                console.log("no reply");
                resolve(null);
            }else{
                console.log("reply found");
                const parsed = JSON.parse(reply);
                if(parsed && parsed.meta && parsed.meta.code==='200'){
                    console.log('reply found');
                    resolve(parsed);
                }else{
                    reject(parsed);
                }
            }
        });
    });
}
const getPlusCache = async (req) => {
    return new Promise(async (resolve,reject) =>{
        console.log("GET:"+getPlusID(req));
        await client.get(getPlusID(req), (err,reply)=>{
            if(err){
                console.trace(err.message);
                reject(err);
            }
            if(reply===null){
                console.log("no reply");
                resolve(null);
            }else{
                const parsed = JSON.parse(reply);
                if(parsed && parsed.meta && parsed.meta.code==200){
                    console.log('reply found');
                    resolve(parsed);
                }else{
                    reject(parsed);
                }
                
            }
        });
    });
}

const setCache = (req,data) => {
    console.log("SET:"+getID(req));
    client.set(getID(req),JSON.stringify(data));
    client.expire(getID(req),TTL);
}

const setPlusCache = (req,data) => {
    console.log("SET:"+getPlusID(req));
    client.set(getPlusID(req),JSON.stringify(data));
    client.expire(getPlusID(req),TTL);
}

const bricklinkApi_GET_cache = (req,res,next) =>{
    if(req.method==="GET"){
        console.log("getting "+getID(req));
        client.get(getID(req),(err,reply)=>{
            if(reply){
                res.send(JSON.parse(reply));
            }else{
                next();
            }
        })
    }else{
        next();
    }
}

/**
 * @method BL_make
 * @description Make bricklink API request and save it in cache
 * @param {Object} user - The user with all of its 4 tokens
 * @param {String} url - The relative path that will be used to create the cache ID
 * @param {String} bl_url - The relative path of the api with query strings
 * @example
 * BL_make(user,"/plus/inventories/items/search",'/inventories');
 * @returns {Boolean} True when cache successfully saved, False when it failed
 */
const BL_make = (user,url,bl_url) => {
    let uri = "https://api.bricklink.com/api/store/v1"+bl_url;
    const oauth = new OAuth.OAuth(
        user.TOKEN_VALUE,
        user.TOKEN_SECRET,
        user.CONSUMER_KEY,
        user.CONSUMER_SECRET,
        "1.0",
        null,
        "HMAC-SHA1"
    )
    oauth.get(uri,oauth._requestUrl, oauth._accessUrl, (err, data) => {
        if(!data || data === undefined){
            return false;
        }
        data = JSON.parse(data);
        //only save data that have a status code of 200
        if(data && data.meta && data.meta.code==200){
            console.log('successfully got inventory data. inventory has '+data.data.length+' items');
            client.set(user.CONSUMER_KEY+":"+url,JSON.stringify(data));
            client.expire(user.CONSUMER_KEY+":"+url,TTL);
            console.log('successfully saved inventory data in cache database');
            return true;
        }else{
            console.log('something went wrong found status code '+data.meta.code);
            return false;
        }
    });                              
}
/**
 * @description Create an ID of a /plus request. this means no query strings
 * @param {Object} req - Express.js request object, needs to include a user with CONSUMER_KEY!
 */
const getPlusID = (req) => req.session.user.CONSUMER_KEY+":"+req.baseUrl+req.route.path;
const getID = (req) => req.session.user.CONSUMER_KEY+":"+req.url;

module.exports = {
    get:getCache,
    getPlus:getPlusCache,
    setPlus:setPlusCache,
    client:client,
    set:setCache,
    BLApi_get:bricklinkApi_GET_cache,
    BL_make:BL_make
};
