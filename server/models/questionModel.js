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
            const tagRows = await addTagToQuestionTag(question_id,question_tag);
            if(tagRows.affectedRows > 0) {
                const mediaRows = await addMediaToQuestionMedia(question_id,media);
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
        console.log("error",error.message);
        res.status(500).send(error.message);
    }
}

const updateQuestionById = async(res,updatedQuestion) => {
    const {id, question_title, question_content, user_id} = updatedQuestion;
    console.log("Question content is", question_content);
    const userIsAdmin = await isAdmin(user_id);
    console.log("user is admin", userIsAdmin);
    try {
        if(userIsAdmin) {
            const editQuery = "UPDATE question SET question_title= ?, question_content= ? WHERE id = ?";
            const [rows] = await promisePool.query(editQuery,[question_title, question_content,id]);
            return rows;
        } else {
            const editQuery = "UPDATE question SET question_title = ?, question_content = ? WHERE id = ? AND user_id = ?";
            const [rows] = await promisePool.query(editQuery,[question_title, question_content,id, user_id]);
            return rows;
        }
    } catch(error) {
        console.log("error",error.message);
        res.status(500).send(error.message);
    }
} 

const isAdmin = async(user_id) => {
    try {
        const userQuery = "SELECT id FROM user WHERE user.user_type_id = 1";
        const [rows] = await promisePool.query(userQuery);
        return rows.some(row => row.id === user_id);
    } catch(error) {
        console.log("error",error.message);
    }
}

module.exports = {
    createQuestion,
    getAllQuestions,
    updateQuestionById
}