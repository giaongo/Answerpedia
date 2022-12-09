"use strict";
const pool = require("../database/database");
const promisePool = pool.promise();

// This function is to get all questions that are added by specific user from favourites table 
const getSavedQuestionByUserId = async(res,user_id) => {
    try {
        const searchQuery = "SELECT q.id, q.question_title, q.question_content, q.date,q.votes,u.username " + 
        "FROM favourites f "+
        "INNER JOIN question q ON f.question_id = q.id "+
        "INNER JOIN user u ON q.user_id = u.id "+
        "WHERE f.user_id = ?";
        const [rows] = await promisePool.query(searchQuery,[user_id]);
        return rows;
    } catch(error) {
        console.log("error",error.message);
        res.status(500).send(error.message);
    }
}

// This function is to add question to favourites table
const addQuestionToFavourite = async(res,data) => {
    try {
        const {question_id, user_id} = data;
        const addQuery = "INSERT INTO favourites(user_id,question_id) VALUES(?,?)";
        const [rows] = await promisePool.query(addQuery,[user_id,question_id]);
        return rows;
    } catch(error) {
        console.log("error",error.message);
        res.status(500).send(error.message);
    }
}

// This function is to remove question from favourites table
const removeQuestionFromFavourite = async(res,question_id, user_id) => {
    try {
        const removeQuery = "DELETE FROM favourites WHERE user_id = ? AND question_id = ?";
        const [rows] = await promisePool.query(removeQuery,[user_id,question_id]);
        return rows;
    } catch(error) {
        console.log("error",error.message);
        res.status(500).send(error.message);
    }
}

// This function is to check whether the question is marked by request user
const questionMarkedByUser = async(res,question_id,user_id) => {
    try {
        const checkQuery = "SELECT EXISTS "+
        "(SELECT question_id FROM favourites WHERE question_id = ? AND user_id = ?)";
        const [rows] = await promisePool.query(checkQuery, [question_id, user_id]);
        return Object.values(rows[0])[0] ? true : false;
    } catch(error) {
        console.log("error",error.message);
        res.status(500).send(error.message);
    }
}

module.exports = {
    getSavedQuestionByUserId,
    addQuestionToFavourite,
    removeQuestionFromFavourite,
    questionMarkedByUser
}