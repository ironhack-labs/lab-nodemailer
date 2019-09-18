const router = require ("express").Router()

router.get("/", (req, res, next) => {
  res.render("auth/profile/profile")
})

module.exports = router
