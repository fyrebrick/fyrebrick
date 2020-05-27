var express = require('express');
var router = express.Router();

router.get('/',(req,res,next)=>{
    res.render("index");

});
router.get('/orders/:order_id/items',(req,res,next)=>{
   res.render('order',{
      'order_id':req.params.order_id
   })
});

module.exports = router;
