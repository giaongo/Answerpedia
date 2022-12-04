"use strict";
const pool = require("../database/database");
const promisePool = pool.promise();

/**
 * Funtion to get list of all the users
 * @param {Response} res
 * @returns list of all the users
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
 * @param {Response} res
 * @param {Integer} userId UserId of the searched user
 * @returns {user} user that has the specific userId
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
 * @param {text} userEmail email of the user that wants to log in
 * @returns {user} user that has entered email
 */
const getUserLogin = async (userEmail) => {
  try {
    console.log("getUserLogin", userEmail);
    const [rows] = await promisePool.execute(
      "SELECT * FROM user WHERE email = ?;",
      [userEmail]
    );
    return rows;
  } catch (e) {
    console.log("error", e.message);
    res.status(500).send(e.message);
  }
};

/**
 * Function to add new users
 * @param {Response} res Response
 * @param {any} req Request contains the details that will be saved in the database
 * @returns {user} user that has been added to database
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
      user.filename,
      user.description,
    ]);
  } catch (e) {
    res.status(500).send(e.message);
    console.error("error", e.message);
  }
};

/**
 * Function to modify existing users
 * @param {Response} res Response
 * @param {*} req Request contains the new details of the users that needs to changed.
 * @returns {user} user with new details that has been changed.
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
