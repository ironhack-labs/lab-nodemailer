const router = require("express").Router();

router.get("/", (req,res) => res.send("este es la casa del usuario"));

router.get("/amigos", (req, res) => res.send("amigos?"));
