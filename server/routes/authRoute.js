"use strict";
const express = require("express");
const router = express.Router();
const {body} = require('express-validator');
const multer = require("multer");
const {login, logout, register} = require('../controllers/authController');


/**
 * Function for filtering img files so user are only able to upload img giles
 * @param {any} req
 * @param {image} file image file for the picture of user
 * @param {any} cb
 */
 const fileFilter = (req, file, cb) => {
    const acceptedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (acceptedTypes.includes(file.mimetype)) {
      //To accept the file pass `true`, like so:
      cb(null, true);
    } else {
      //To reject the file pass `false`, like so:
      cb(null, false);
    }
  
    console.log(file);
  };
  /**
   * For saving the picture in the uploads folder
   */
  const upload = multer({ dest: "uploads/", fileFilter });

router.get('/logout', logout);
router.post('/login', login);
router.post('/register', 
upload.single("user"),
body('username').isLength({min: 3}).trim().escape(),
body('email').isEmail().normalizeEmail(),  
body('password').isLength({min: 8}).trim(), 
register);

module.exports = router;