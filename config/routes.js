const router = require("express").Router();
const miscController = require("../controllers/misc.controller");

// home
router.get("/", miscController.home);

// Get - register form
router.get("/register", miscController.register)

// Post - resgister form
router.post("/register", miscController.doRegister)

// confirmation route
router.get("/activate/:token", miscController.activate)

// Get - User profile
router.get("/userProfile/:id", miscController.profile)

module.exports = router;
