const express = require('express');
const router = express.Router();
const itemRoutes = require("./itemRoutes");
const itemsRoutes = require("./itemsRoutes");

router.use("/item",itemRoutes);
router.use("/items",itemsRoutes);
router.get('/',(req,res)=>{
    res.render('inventory',{active:"inventory"});
});
module.exports = router;