const express = require("express");

const router = express.Router();

const check = require('../middlewares/activeMid')
router.all("/*", check.checkUser)
router.get("/" , (req,res, next)=>{
  const user = req.user;
  res.render("profile/index", {user});
})

router.get("/addPost", (req, res) => {
  res.render("profile/addPost")
}) 

router.post("/addPost", upload.single('photo'), (req, res) => {

  const {content, picName} = req.body;
  const {secure_url} = req.file;
  const creatorId = req.user.id;

  const newPost = new Post({
    content,
    creatorId,
    picPath: secure_url,
    picName
  });

  newPost
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      res.render("auth/login", { message: "Something went wrong" });
    });


  
}) 

module.exports = router;