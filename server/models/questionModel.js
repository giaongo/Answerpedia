"use strict";
const pool = require("../database/database");
const promisePool = pool.promise();

// This function will add data to question, question_tag and question_media tables
const createQuestion = async(res,questionData) => {
    const {question_title, question_content,date,user_id,question_tag,media} = questionData;
    console.log("question tag",question_tag);
    console.log();
    try {
        const questionQuery = "INSERT INTO question(question_title,question_content,date,user_id) VALUES(?,?,?,?)";
        const [questionRows] = await promisePool.query(questionQuery,[question_title,question_content,date,user_id]);
        if(questionRows.affectedRows > 0) {
            const question_id = questionRows.insertId;
            console.log("Added data to question table successfully");
            const tagRows = await addTagToQuestionTag(question_id,question_tag);
            if(tagRows.affectedRows > 0) {
                console.log("Added data to tag table successfully");
                const mediaRows = await addMediaToQuestionMedia(question_id,media);
                console.log("added data to media table successfully");
                return mediaRows;
            }
        }
    } catch(error) {
        res.status(500).send(error.message);
    }
}

const addTagToQuestionTag = async(question_id,question_tag) => {
    const tagQuery = "INSERT INTO question_tag(tag,question_id) VALUES ?"
    const [tagRows] = await promisePool.query(tagQuery,[question_tag.map(tag => [tag.trim().toLowerCase(),question_id])]);
    return tagRows;
}

const addMediaToQuestionMedia = async(question_id,media) => {
    const mediaQuery = "INSERT INTO question_media(media,question_id) VALUES ?";
    const [mediaRows] = await promisePool.query(mediaQuery,[media.map(element => [element,question_id])]);
    return mediaRows;
}

// Function to fetch all distinct questions
const getAllQuestions = async(res) => {
    try {
        const questionQuery = "SELECT id,question_title,question_content,date,votes,user_id,tag,media FROM question q LEFT JOIN question_tag qt ON q.id = qt.question_id LEFT JOIN question_media qm ON q.id = qm.question_id GROUP BY q.id";
        const [rows] = await promisePool.query(questionQuery);
        return rows;
    } catch(error) {
        console.log("error",error.message);s
        res.status(500).send(error.message);
    }
}
module.exports = {
    createQuestion,
    getAllQuestions
}