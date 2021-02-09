const router = require("express").Router();
const miscController = require("../controllers/misc.controller");

// home
router.get("/", miscController.home);


module.exports = router;
