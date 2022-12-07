"use strict";
const express = require("express");
const router = express.Router();
const {body} = require('express-validator');
const {login, logout, register, modifyUser} = require('../controllers/authController');
const multer = require('multer');



/**
 * Function for filtering img files so user are only able to upload img files
 * This will be used in user modify
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



router.post('/login', login);

router.post('/register', 

body('username').isLength({min: 3}).trim().escape(),
body('email').isEmail().normalizeEmail(),  
body('password').isLength({min: 8}).trim(), 
register);


router.get('/logout', logout);
module.exports = router;