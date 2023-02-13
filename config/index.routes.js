const router = require("express").Router();
const passport = require('passport');
const miscController = require("../controllers/misc.controller");
const authController = require("../controllers/auth.controller");
const usersController = require("../controllers/users.controller");
const productsController = require("../controllers/products.controller");
const authMiddlewares = require("../middlewares/authMiddlewares");
const fileUploader = require('../config/cloudinary.config');

const SCOPES = [
  "profile",
  "email"
]

// MISC
router.get("/", miscController.home);

// AUTH
router.get("/register", authController.register);
router.post("/register", authController.doRegister);
router.get("/login", authMiddlewares.isNotAuthenticated, authController.login);
router.post("/login", authController.doLogin);

router.get('/login/google', authMiddlewares.isNotAuthenticated, passport.authenticate('google-auth', { scope: SCOPES  }))
router.get('/auth/google/callback', authMiddlewares.isNotAuthenticated, authController.doLoginGoogle)
router.get("/logout", authMiddlewares.isAuthenticated, authController.logout);
router.get('/activate/:token', authMiddlewares.isNotAuthenticated, authController.activateAccount)

// USERS
router.get("/profile", authMiddlewares.isAuthenticated, usersController.profile);

// PRODUCTS
router.get("/products/store", authMiddlewares.isAuthenticated, productsController.list);
router.get("/products/create", authMiddlewares.isAuthenticated, productsController.create);
router.post("/products/create", authMiddlewares.isAuthenticated, fileUploader.single('image'), productsController.doCreate);
router.get("/products/:id", authMiddlewares.isAuthenticated, productsController.details);
router.delete("/products/:id", authMiddlewares.isAuthenticated, productsController.delete);

module.exports = router;