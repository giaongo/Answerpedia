"use strict";
const pool = require("../database/database");
const promisePool = pool.promise();

// This function is for adding data to answer and answer_media table
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
// This function is for adding data to answer_media table
const addMediaToAnswerMedia = async(answer_id, media) => {
    const mediaQuery = "INSERT INTO answer_media(media,answer_id) VALUES ?";
    const [mediaRows] = await promisePool.query(mediaQuery,[media.map(element => [element,answer_id])]);
    return mediaRows;
}

// This function is to check if there is question_id in the answer table
const hasAnswer = async(question_id) => {
    try {
        const checkExistenceQuery = "SELECT EXISTS(SELECT question_id FROM answer WHERE question_id = ?)";
        const [rows] = await promisePool.query(checkExistenceQuery,[question_id]);
        return Object.values(rows[0])[0] ? true : false
    } catch(error) {
        console.log("error",error);
    }
}

/* This function is for deleting answer's data from answer table and answer_media table by the corresponding question_id*/
const deleteAnswerByQuestionId = async(question_id) => {
    if(await hasAnswer(question_id)) {
        const answerMediaQuery = "DELETE FROM answer_media WHERE answer_id IN (SELECT id FROM answer WHERE question_id = ?)";
        const [answerMediaRows] = await promisePool.query(answerMediaQuery,[question_id]);
        if (answerMediaRows.affectedRows > 0) {
            console.log("delete answer media table successfully");
            const answerQuery = "DELETE FROM answer WHERE question_id = ?";
            const [answerRows] = await promisePool.query(answerQuery,[question_id]);
            return answerRows;
        }
    }
    return 0;
}

/*This function is for getting vote numbers from answer table*/ 
const updateAnswerVoteNumbers = async (req, res, vote) => {
    try {
        const query = "update answer set votes = ? where id = ?";
        const [rows] = await promisePool.query(query, [vote, req.body.answer_id]);
	return rows;
    } catch (e) {
        res.status(500).send(e.message);
        console.log("error: ", e);
    }
}
/* This function is for getting all the answers answered by the user*/
const getAnswerByUser = async(res, req) => {
    try{
        const answerQuery = "SELECT answer.id, answer_content, answer.date, answer.votes,answer.user_id, question_id, question_content FROM answer INNER JOIN question ON answer.question_id = question.id WHERE answer.user_id = ?";
        const answers = await promisePool.query(answerQuery,[req.user.id]);
        return answers;
    } catch(e) {
        res.status(500).send(e.message);
        console.log("error: ", e);
    }
}


module.exports = {
    createAnswer,
    deleteAnswerByQuestionId,
    updateAnswerVoteNumbers,
    getAnswerByUser
}