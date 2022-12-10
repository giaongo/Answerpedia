const express = require("express");
const router = express.Router();
const multer = require("multer");
const passport = require('../utils/passport');
const {body} = require("express-validator");
const tagController = require("../controllers/tagController");


router.get("/",
    passport.authenticate('jwt', {session: false}),
    tagController.getAllTags
 )

router.get("/usertags",
    passport.authenticate('jwt', {session: false}),
    tagController.getAllUserTags
 )


 module.exports = router;