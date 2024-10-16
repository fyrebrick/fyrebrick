/**
 * routes for path (not used)
 */

const router = require("express").Router();
const OAuth = require('oauth');

//Controller inside route. 
router.all('/*',(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    let uri = "https://api.bricklink.com/api/store/v1"+req.url;
    const oauth = new OAuth.OAuth(
        req.session.user.TOKEN_VALUE||req.query.TOKEN_VALUE||req.body.TOKEN_VALUE,
        req.session.user.TOKEN_SECRET||req.query.TOKEN_SECRET||req.body.TOKEN_SECRET,
        req.session.user.CONSUMER_KEY||req.query.CONSUMER_KEY||req.body.CONSUMER_KEY,
        req.session.user.CONSUMER_SECRET||req.query.CONSUMER_SECRET||req.body.CONSUMER_SECRET
        "1.0",
        null,
        "HMAC-SHA1"
    );
    switch (req.method){
        case "GET":
            oauth.get(uri,oauth._requestUrl, oauth._accessUrl, (err, data) => {
                res.send(JSON.stringify(JSON.parse(data), null, 4));
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

const doCall = (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    let uri = "https://api.bricklink.com/api/store/v1"+req.url;
    const oauth = new OAuth.OAuth(
        req.session.user.TOKEN_VALUE||req.query.TOKEN_VALUE||req.body.TOKEN_VALUE,
        req.session.user.TOKEN_SECRET||req.query.TOKEN_SECRET||req.body.TOKEN_SECRET,
        req.session.user.CONSUMER_KEY||req.query.CONSUMER_KEY||req.body.CONSUMER_KEY,
        req.session.user.CONSUMER_SECRET||req.query.CONSUMER_SECRET||req.body.CONSUMER_SECRET
        "1.0",
        null,
        "HMAC-SHA1"
    );
    switch (req.method){
        case "GET":
            oauth.get(uri,oauth._requestUrl, oauth._accessUrl, (err, data) => {
                return JSON.parse(data);
            });
            break;
        case "POST":
            oauth.post(uri,oauth._requestUrl, oauth._accessUrl, JSON.stringify(req.body), "application/json", (err, data) => {
                return JSON.parse(data);
            });
            break;
        case "PUT":
            oauth.put(uri,oauth._requestUrl, oauth._accessUrl, JSON.stringify(req.body), "application/json", (err, data) => {
                return JSON.parse(data);
            });
            break;
        case "DELETE":
            oauth.delete(uri,oauth._requestUrl, oauth._accessUrl, (err, data) => {
                return JSON.parse(data);
            });
            break;
        default:
            return {message:"This type of request is not supported"};
    }
}
module.exports = router;
