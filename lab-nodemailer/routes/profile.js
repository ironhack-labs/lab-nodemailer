const router = require ("express").Router()
const User = require("./../models/User")

router.get("/", (req, res, next) => {
  res.render("auth/profile/profile")
})

router.post("/update", (req, res, next) => {
  let {_id, username, email} = req.body

  User.findByIdAndUpdate(_id, {
    username,
    email
  }).then(usernameUpdated => {
    console.log("Entró")
    res.redirect("/")
  }).catch(err => console.log(err))
})

module.exports = router
