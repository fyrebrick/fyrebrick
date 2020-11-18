const express = require('express');
const { route } = require('../apiRoutes');
const router = express.Router();

router.get('/',async(req,res,next)=>{
    res.render('invest',{active:"inventory"});
 });

const investigateInventory = require("../../functions/bricklink/investigateInventory");
router.get("/data",async (req,res)=>{
    await investigateInventory(req.session.user).then((investData)=>{
        res.send(investData);
    });
});

const addToInventoryIds = require("../../functions/bricklink/addToInventoryIds");
router.post("/data/add",async(req,res)=>{
    await addToInventoryIds(req.body.items,req.body.qty,req.body.index,await User.findOne({_id:req.session._id})).then((data)=>{
        res.send(data);
    });
});

const combineInventoryIds = require('../../functions/bricklink/combineInventoryIds');
router.post("/data/combine", async (req,res)=>{
    await combineInventoryIds(req.body.items,req.body.qty,req.body.index,req.body.remarks,req.body.newRemark,await User.findOne({_id:req.session._id})).then((data)=>{
        res.send(data);
    });
});


module.exports = router;