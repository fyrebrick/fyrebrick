const redis = require('redis');
const client = redis.createClient(3001,'127.0.0.1');
//const OAuth = require('oauth');
const TTL = 4 * 60;

const getCache = (_id,url) => {
    return JSON.parse(client.get(_id+":"+url));
}

const setCache = (_id,url,data) => {
    client.set(_id+":"+url,JSON.stringify(data));
    client.expire(_id+":"+url,TTL);
}

const bricklink_GET_cache = (req,res,next) =>{
    if(req.method==="GET"){
        client.get(req.session.id+":"+req.url,(err,reply)=>{
            if(reply){
                res.send(reply);
            }else{
                let uri = "https://api.bricklink.com/api/store/v1"+req.url;
                const oauth = new OAuth.OAuth(
                    req.session.user.TOKEN_VALUE,
                    req.session.user.TOKEN_SECRET,
                    req.session.user.CONSUMER_KEY,
                    req.session.user.CONSUMER_SECRET,
                    "1.0",
                    null,
                    "HMAC-SHA1"
                )
                oauth.get(uri,oauth._requestUrl, oauth._accessUrl, (err, data) => {                
                    client.set(req.session.id+":"+req.url,JSON.stringify(data),TTL);  
                    client.expire(req.session.id+":"+req.url,TTL)
                });                              
            }
        })
    }else{
        next();
    }
}

module.exports = {
    get:getCache,
    client:client,
    set:setCache,
    BL_get:bricklink_GET_cache
};
