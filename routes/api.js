var express = require('express');
var router = express.Router();
var OAuth = require('oauth');
var oauth_data = require('../oauth');
/* GET home page. */
var oauth = new OAuth.OAuth(
    process.env.TOKEN_VALUE,
    process.env.TOKEN_SECRET,
    process.env.CONSUMER_KEY,
    process.env.CONSUMER_SECRET,
    oauth_data.oauth_version,
    null,
    oauth_data.oauth_signature_method
);
router.all('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send({"meta":{"description":"API call not found","message":"API call not found","code":"404"}});
});

router.all('/:v1', function(req, res, next) {
    getJSON(req,res);
});
router.all('/:v1/:v2', function(req, res, next) {
    getJSON(req,res);
});
router.all('/:v1/:v2/:v3', function(req, res, next) {
    getJSON(req,res);
});
router.all('/:v1/:v2/:v3/:v4', function(req, res, next) {
    getJSON(req,res);
});
router.all('/:v1/:v2/:v3/:v4/v5', function(req, res, next) {
    getJSON(req,res);
});

let getJSON = function(req,res){
    let link = 'https://api.bricklink.com/api/store/v1/';
    link += req.params.v1;
    if(req.params.v2){
        link+='/'+req.params.v2;
    }
    if(req.params.v3){
        link+='/'+req.params.v3;
    }
    if(req.params.v4){
        link+='/'+req.params.v4;
    }
    if(req.params.v4){
        link+='/'+req.params.v4;
    }
    if(req.params.v4){
        link+='/'+req.params.v4;
    }

    console.log("GET JSON from "+link);
    oauth.get(
        link,
        process.env.TOKEN_VALUE,
        process.env.TOKEN_SECRET, //test user secret
        function (e, data){
            if (e) console.error(e);
            res.setHeader('Content-Type', 'application/json');
            let obj = JSON.parse(new Object(data));
            if(req.params.v3==='items'){
                res.send(({
                    "meta":obj.meta,
                    "data":obj.data[0]
                }));
            }else{
                res.end((data));
            }

        });
};

module.exports = router;
