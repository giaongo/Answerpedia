"use strict";
const pool = require("../database/database");
const promisePool = pool.promise();


const getUserTags = async(res, req) => {
    try{
        const tagQuery = "SELECT tag FROM question_tag qt INNER JOIN question q ON qt.question_id = q.id WHERE q.user_id = ?";
        const userTags = await promisePool.query(tagQuery,[req.user.id]);
        return userTags;
    }catch(error) {
        console.log("error",error.message);
        res.status(500).send(error.message);
    }
}

const getTags = async(res) => {
    try{
        const tagQuery = "SELECT tag FROM question_tag qt INNER JOIN question q ON qt.question_id = q.id";
        const tags = await promisePool.query(tagQuery)
        return tags;
    }catch(error) {
        console.log("error",error.message);
        res.status(500).send(error.message);
    }
}

module.exports = {
    getUserTags,
    getTags
}