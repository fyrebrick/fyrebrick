var express = require('express');
var router = express.Router();

router.get('/new',(req,res)=>{
    res.render('orderList',{active:'orders'});
});

module.exports = router;
