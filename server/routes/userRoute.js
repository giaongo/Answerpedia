"use strict";
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { body } = require("express-validator");
const userController = require("../controllers/userController");

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

router
  .get("/", userController.getUsers)
  .get("/:id", userController.getUser)
  .post(
    "/",
    upload.single("user"),
    body("username").isLength({ min: 3 }).trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }).trim(),
    body("description").isLength({ min: 8 }).trim(),
    userController.addUser)
    .post('/login', userController.login);

module.exports = router;
