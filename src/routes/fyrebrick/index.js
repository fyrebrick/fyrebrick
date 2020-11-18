const express = require('express');
const router = express.Router();
const orderRouter = require("./fyrebrick/orderRoutes");

router.use('/order',orderRouter);

module.exports = router;