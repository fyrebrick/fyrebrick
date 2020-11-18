const express = require('express');
const router = express.Router();
const changeRemark = require('../../../functions/bricklink/changeRemark');

router.get("/add",(req,res)=>{
    res.render('add',{active:"inventory"});
});

router.post("/remarks/update",(req,res)=>{
    (await changeRemark)(req.body.ids,req.body.newRemarkName,await User.findOne({_id:req.session._id})).then((data)=>{
        res.send(data);
    });
})

module.exports = router;