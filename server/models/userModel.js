"use strict";
const pool = require("../database/database");
const promisePool = pool.promise();

/**
 * Funtion to get list of all the users
 */
const getAllUsers = async (res) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
    const [rows] = await promisePool.query("SELECT * FROM user");
    return rows;
  } catch (e) {
    res.status(500).send(e.message);
    console.error("error", e.message);
  }
};

/**
 * Function to get user according to Id
 */
const getUserById = async (res, userId) => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM user WHERE id =?", [
      userId,
    ]);
    return rows[0];
  } catch (e) {
    res.status(500).send(e.message);
    console.error("error", e.message);
  }
};

/**
 * Function to check email address entered to log in
 */
const getUserLogin = async (userEmail) => {
  try {
    console.log("getUserLogin", userEmail);
    const [rows] = await promisePool.execute(
      "SELECT * FROM user WHERE email = ?;",
      userEmail
    );
    return rows;
  } catch (e) {
    console.log("error", e.message);
    res.status(500).send(e.message);
  }
};

/**
 * Function to add new users
 */
const addUser = async (res, user) => {
  try {
    let query = `INSERT INTO user(id, username, email, password, user_type_id, picture_name, description) values(?,?,?,?,?,?,?)`;
    return promisePool.query(query, [
      null,
      user.username,
      user.email,
      user.password,
      user.user_type_id,
      user.picture_name,
      user.description,
    ]);
  } catch (e) {
    res.status(500).send(e.message);
    console.error("error", e.message);
  }
};

/**
 * Function to modify existing users
 */
const modifyUser = async (res, req) => {
  try {
    const user = req.body;
    let query = `UPDATE user SET name = ?, email = ?, password = ?, description = ? WHERE user_id = ?;`;
    return promisePool.query(query, [
      user.name,
      user.email,
      user.passwd,
      user.description,
      req.user.user_id,
    ]);
  } catch (e) {
    res.status(500).send(e.message);
    console.error("error", e.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserLogin,
  modifyUser,
  addUser,
};
