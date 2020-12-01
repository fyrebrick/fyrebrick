const router = require("express").Router();
const OAuth = require('oauth');
const bricklinkPlus = require('bricklink-plus');
const User = require('../../models/user');
const inventoriesRoutes = require("./inventories");

router.use('/inventories',inventoriesRoutes);

module.exports = router;
