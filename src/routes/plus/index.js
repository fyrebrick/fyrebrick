const router = require("express").Router();
const OAuth = require('oauth');
const bricklinkPlus = require('bricklink-plus');
const User = require('../../models/user');
const iventoriesRoutes = require("./inventories");

router.use('/inventories',iventoriesRoutes);

module.exports = router;
