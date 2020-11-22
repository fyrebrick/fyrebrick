const router = require("express").Router();
const OAuth = require('oauth');
const redis = require('../middlewares/redis');

router.all('/*',redis.BLApi_get,(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    let uri = "https://api.bricklink.com/api/store/v1"+req.url;
    const oauth = new OAuth.OAuth(
        req.session.user.TOKEN_VALUE,
        req.session.user.TOKEN_SECRET,
        req.session.user.CONSUMER_KEY,
        req.session.user.CONSUMER_SECRET,
        "1.0",
        null,
        "HMAC-SHA1"
    );
    switch (req.method){
        case "GET":
            oauth.get(uri,oauth._requestUrl, oauth._accessUrl, (err, data) => {                
                redis.set(req,data);
                res.send(JSON.parse(data));
            });
            break;
        case "POST":
            oauth.post(uri,oauth._requestUrl, oauth._accessUrl, JSON.stringify(req.body), "application/json", (err, data) => {
                res.send(JSON.parse(data));
            });
            break;
        case "PUT":
            oauth.put(uri,oauth._requestUrl, oauth._accessUrl, JSON.stringify(req.body), "application/json", (err, data) => {
                res.send(JSON.parse(data));
            });
            break;
        case "DELETE":
            oauth.delete(uri,oauth._requestUrl, oauth._accessUrl, (err, data) => {
                res.send(JSON.parse(data));
            });
            break;
        default:
            res.send({message:"This type of request is not supported"});
    }
});

module.exports = router;
