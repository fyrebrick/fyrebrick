const redis = require('redis');
const LZUTF8 = require('lzutf8');
const client = redis.createClient(3001,'127.0.0.1');
const OAuth = require('oauth');
const TTL = 4 * 60;

const getCache = async (req) => {
    return new Promise(async (resolve,reject) =>{
        console.log("GET:"+getID(req));
        await client.get(req.session._id+":"+req.baseUrl+req.route.path, (err,reply)=>{
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

const setCache = (req,data) => {
    console.log("GET:"+getID(req));
    client.set(getID(req),JSON.stringify(data),'EX',TTL);
}

// const en = (data) => {
//     const str = JSON.stringify(data)
//     const unit8 = LZUTF8.compress(str);
//     const buff = Buffer.from(unit8.buffer);
//     return (buff)
// };
// const de = (data) => {
//     if(!data){
//         return null;
//     }
//     const buff = new Buffer.from(data, 'utf8');
//     //string is corrupt after decoding
//     console.log(JSON.parse(LZUTF8.decompress(buff)));
//     return JSON.parse(LZUTF8.decompress(buff));
// };

const bricklink_GET_cache = (req,res,next) =>{
    if(req.method==="GET"){
        client.get(req.session._id+":"+req.baseUrl+req.route.path,(err,reply)=>{
            if(reply){
                res.send(JSON.parse(reply));
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
                    client.set(getID(req),JSON.stringify(data),'EX',TTL);
                });                              
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
        client.set(user._id+":/plus/inventories/items",JSON.stringify(data),'EX',TTL);
    });                              
}
const getID = (req) => req.session._id+":"+req.baseUrl+req.route.path;
module.exports = {
    get:getCache,
    client:client,
    set:setCache,
    BL_get:bricklink_GET_cache,
    BL_make:bricklink_make_cache
};
