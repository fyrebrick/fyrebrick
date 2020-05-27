var express = require('express');
var router = express.Router();
var OAuth = require('oauth');
var oauth_data = require('../oauth');
/* GET home page. */
var oauth = new OAuth.OAuth(
    process.env.TokenValue,
    process.env.TokenSecret,
    process.env.ConsumerKey,
    process.env.ConsumerSecret,
    oauth_data.oauth_version,
    null,
    oauth_data.oauth_signature_method
);

router.all('/:value', function(req, res, next) {
  oauth.get(
      'https://api.bricklink.com/api/store/v1/'+req.params.value,
      process.env.TokenValue,
      process.env.TokenSecret, //test user secret
      function (e, data){
        if (e) console.error(e);
          res.setHeader('Content-Type', 'application/json');
          res.end((data));
      });
});
router.all('/:value/:value2', function(req, res, next) {
    oauth.get(
        'https://api.bricklink.com/api/store/v1/'+req.params.value+"/"+req.params.value2,
        process.env.TokenValue,
        process.env.TokenSecret, //test user secret
        function (e, data){
            if (e) console.error(e);
            res.setHeader('Content-Type', 'application/json');
            res.end((data));
        });
});
router.all('/:value/:value2/:value3', function(req, res, next) {
    oauth.get(
        'https://api.bricklink.com/api/store/v1/'+req.params.value+"/"+req.params.value2+"/"+req.params.value3,
        process.env.TokenValue,
        process.env.TokenSecret, //test user secret
        function (e, data){
            if (e) console.error(e);
            res.setHeader('Content-Type', 'application/json');
            res.end((data));
        });
});



module.exports = router;
