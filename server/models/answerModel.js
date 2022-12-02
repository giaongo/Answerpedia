"use strict";
const pool = require("../database/database");
const promisePool = pool.promise();

const createAnswer = async(res,answerData) => {
    const {answer_content, date, user_id,media,question_id} = answerData;
    try {
        const answerQuery = "INSERT INTO answer(answer_content,date,user_id,question_id) VALUES(?,?,?,?)";
        const [answerRows] = await promisePool.query(answerQuery,[answer_content,date,user_id,question_id]);
        if(answerRows.affectedRows > 0) {
            const answer_id = answerRows.insertId;
            const mediaRows = await addMediaToAnswerMedia(answer_id,media);
            return mediaRows;
        }
    } catch(error) {
        console.log("error",error.message);
        res.status(500).send(error.message);
    }
}

const addMediaToAnswerMedia = async(answer_id, media) => {
    const mediaQuery = "INSERT INTO answer_media(media,answer_id) VALUES ?";
    const [mediaRows] = await promisePool.query(mediaQuery,[media.map(element => [element,answer_id])]);
    return mediaRows;
}

module.exports = {
    createAnswer
}