const router = require("express").Router();
const usersController = require("../controllers/users.controllers");
const miscController = require("../controllers/misc.controller");

router.get("/", miscController.home);

router.get("/register", usersController.register);
router.post("/register", usersController.doRegister);

router.get("/login", usersController.login);
router.post("/login", usersController.doLogin);

router.get("/activate/:token", usersController.activate);

router.post("/logout", usersController.logout);

router.get("/profile", usersController.profile);

module.exports = router;
