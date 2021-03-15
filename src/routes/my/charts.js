const router = require('express').Router();
const controller = require("../../controllers/my/charts")

router.get('/main',controller.main);


module.exports = router;