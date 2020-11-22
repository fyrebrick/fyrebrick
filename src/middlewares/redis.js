const redis = require('redis');
const client = redis.createClient(3001,'127.0.0.1');
const OAuth = require('oauth');
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
                resolve(JSON.parse(reply));
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
                console.log("reply found");
                console.log(reply);
                resolve(JSON.parse(reply));
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

const bricklink_make_cache = (user,url,bl_url) => {
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
        client.set(user.CONSUMER_KEY+":"+url,JSON.stringify(data));
        client.expire(getID(user.CONSUMER_KEY+":"+url),TTL);
    });                              
}

const getPlusID = (req) => req.session.user.CONSUMER_KEY+":"+req.baseUrl+req.route.path;
const getID = (req) => req.session.user.CONSUMER_KEY+":"+req.url;

module.exports = {
    get:getCache,
    getPlus:getPlusCache,
    setPlus:setPlusCache,
    client:client,
    set:setCache,
    BLApi_get:bricklinkApi_GET_cache,
    BL_make:bricklink_make_cache
};
