var express = require('express');
var router = express.Router();

router.get('/',(req,res,next)=>{
    console.log("test");
    res.render("settings");

});
router.post('/update',(req,res,next)=>{
    console.log("test");
});


module.exports = router;
