const router = require("express").Router();
const miscController = require("../controllers/misc.controller");

// home
router.get("/", miscController.home);

// Get - register form
router.get("/register", miscController.register)

// Post - resgister form
router.post("/register", miscController.doRegister)

// Confirmation route
router.post("/activate/:token", miscController.activate);

module.exports = router;
