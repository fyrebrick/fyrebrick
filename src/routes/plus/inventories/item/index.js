const express = require('express');
const router = express.Router();
const updateRoutes = require('./updateRoutes');
const User = require('../../../../models/user');
const Inventory = require("../../../../models/inventory");
const bricklink = require("../../../../helpers/update/bricklink");

router.use('/update',updateRoutes);

router.get('/:inventory_id',async (req,res) =>{
    res.send(await Inventory({inventory_id:req.params.inventory_id,CONSUMER_KEY:req.session.CONSUMER_KEY}))
});

module.exports = router;