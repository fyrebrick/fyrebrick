var express = require('express');
var router = express.Router();

router.get('/',(req,res,next)=>{
    res.render("settings");

});
router.post('/update',(req,res,next)=>{
});


module.exports = router;
