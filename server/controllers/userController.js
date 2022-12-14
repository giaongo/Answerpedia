"use strict";

const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { makeThumbnail } = require("../utils/image");
const passport = require("../utils/passport");

/**
 * Function for getting the list of all users
 * @param {any} req
 * @param {Response} res
 */
const getUsers = async (req, res) => {
  const users = await userModel.getAllUsers(res);
  users.map((user) => {
    delete user.password;
  });
  res.json(users);
};

/**
 * For getting single user, if not available letting the user know
 * @param {any} req
 * @param {Response} res
 */
const getUser = async (req, res) => {
  console.log(req.params.id);
  const user = await userModel.getUserById(res, req.params.id);
  if (user) {
    delete user.password;
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

/**
 * Function to add users
 * @param {any} req req.body contains all the details needed to add user
 * @param {Response} res
 */
const addUser = async (req, res) => {
  const errors = validationResult(req);
  console.log("validation errors", errors);

  if (!req.file) {
    res.status(400).json({ message: "user picture not found" });
  } else if (errors.isEmpty()) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    req.body.password = passwordHash;
    const user = req.body;
    await makeThumbnail(req.file.path, req.file.filename);
    user.filename = req.file.filename;
    if (!user.user_type_id) {
      user.user_type_id = 2;
    }
    const addUser = await userModel.addUser(user, res);
    res.status(201).json({ message: "user created", userId: addUser });
  } else {
    res
      .status(404)
      .json({ message: "user creation failed", errors: errors.array() });
  }
};

/**
 * Function to check token
 * @param {any} req
 * @param {Response} res
 */
const checkToken = (req, res) => {
  delete req.user.password;
  res.json({ user: req.user });
};

/**
 * Function for modifying user
 * @param {any} req
 * @param {Response} res
 */
const modifyUser = async (req, res) => {
  const errors = validationResult(req);
  console.log("validation errors", errors);
  console.log(req.body);
  console.log(req.file);
  if (!req.file) {
    res.status(400).json({ message: "user file not found" });
  } else if (errors.isEmpty()) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    req.body.password = passwordHash;
    // This will be used for user modified and save picture
    req.body.picture_name = req.file.filename;
    await makeThumbnail(req.file.path, req.file.filename);
   

    const updateUser = await userModel.modifyUser(res, req);
    if (updateUser) {
      res.status(201).json({ message: "User data updated" });
    } else {
      res
        .sendStatus(404)
        .json({ message: "user creation failed", errors: errors.array() });
    }
  }
};

module.exports = {
  addUser,
  getUsers,
  getUser,
  checkToken,
  modifyUser,
};
