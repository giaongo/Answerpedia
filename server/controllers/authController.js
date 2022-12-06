"use strict";

const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require('passport');
require('dotenv').config();
//const {makeThumbnail} = require('../utils/image');

/**
 * Function to add users
 */
const register = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  console.log("validation errors", errors);
  console.log(req.file)
   if (errors.isEmpty()) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    req.body.password = passwordHash;
    const user = req.body;
    // This will be used for user modified and save picture
    //user.picture_name = req.file.filename;
    //await makeThumbnail(req.file.path, req.file.filename);
    if (!user.user_type_id) {
      user.user_type_id = 2;
    }
    const addUser = await userModel.addUser(res, user);
    res.status(201).json({ message: "user created", userId: addUser });
  } else {
    res
      .status(404)
      .json({ message: "user creation failed", errors: errors.array() });
  }
};

/**
 * Function to check for user details while log in 
 */
const login = (req, res) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      console.log("user is",user);
      if (err || !user) {
        return res.status(400).json({
            message: 'Something is not right',
            user   : user,
        });
      }
    req.login(user, {session: false}, (err) => {
        if (err) {
            res.send(err);
        }
        // generate a signed son web token with the contents of user object and return it in the response
        // don not include password in token/yser object when sending to client
        delete user.password;
        const token = jwt.sign(user, process.env.JWT_SECRET);
        console.log("return token from server",token);
        return res.json({user, token});
    });
  })(req, res);
};


/**
 * Function used for user to log out and delete the token
 */
const logout = (req, res) => {
    console.log('some user logged out');
    res.json({message: 'logged out'});
  };

module.exports = {
  register,
  login,
  logout
};
