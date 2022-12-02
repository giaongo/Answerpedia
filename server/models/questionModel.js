"use strict";
const { curryRight } = require("lodash");
const pool = require("../database/database");
const promisePool = pool.promise();
const {deleteAnswerByQuestionId} = require("./answerModel");

// This function will add data to question, question_tag and question_media tables
const createQuestion = async(res,questionData) => {
    const {question_title, question_content,date,user_id,question_tag,media} = questionData;
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
// This function is to add tag data to question_tag
const addTagToQuestionTag = async(question_id,question_tag) => {
    const tagQuery = "INSERT INTO question_tag(tag,question_id) VALUES ?"
    const [tagRows] = await promisePool.query(tagQuery,[question_tag.map(tag => [tag.trim().toLowerCase(),question_id])]);
    return tagRows;
}

// This function is to add media data to question_media
const addMediaToQuestionMedia = async(question_id,media) => {
    const mediaQuery = "INSERT INTO question_media(media,question_id) VALUES ?";
    const [mediaRows] = await promisePool.query(mediaQuery,[media.map(element => [element,question_id])]);
    return mediaRows;
}

// This function is to update question by question_id
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
        return roe
    } catch(error) {
        console.log("error",error.message);
        res.status(500).send(error.message);
    }
} 

// Function to delete question from table if user is admin or owner of the requested question
const deleteQuestionById = async(res,questionId, userId) => {
    try{
        const userIsAdmin = await isAdmin(userId);
        const userIsOwnerOfQuestion = await isOwnerOfQuestion(questionId,userId);
        console.log(`User is owner ${userIsOwnerOfQuestion} or admin ${userIsAdmin}`);
        if(userIsAdmin || userIsOwnerOfQuestion) {
            const result = await deleteQuestionAndLinkedAnswers(questionId);
            return result;
        }
    } catch(error) {
        console.log("error",error.message);
        res.status(500).send(error.message);
    }
}

/* Function to delete question and its linked answers from question, question_media,question_tag,answer,
answer_media table */
const deleteQuestionAndLinkedAnswers = async(questionId) => {
    const deleteFromQuestionMedia = "DELETE FROM question_media WHERE question_id = ?";
    const [questionMediaRows] = await promisePool.query(deleteFromQuestionMedia,[questionId]);
    if(questionMediaRows.affectedRows > 0) {
        console.log("delete question media successfully");
        const deleteFromQuestionTag =  "DELETE FROM question_tag WHERE question_id = ?";
        const [questionTagRows] = await promisePool.query(deleteFromQuestionTag,[questionId]);
        if(questionTagRows.affectedRows > 0) {
            console.log("Delete question tag successfully");
            const removeCorrespondingAnswer =  await deleteAnswerByQuestionId(questionId);
            if(!removeCorrespondingAnswer || removeCorrespondingAnswer.affectedRows > 0) {
                if(removeCorrespondingAnswer.affectedRows > 0) {
                    console.log("remove all linked answers successfully");
                }
                const deleteFromQuestion = "DELETE FROM question WHERE id = ?";
                const [questionRows] = await promisePool.query(deleteFromQuestion,[questionId]);
                return questionRows;
            }
        }
    }
}

// This function is to check if user is an owner of the requested question
const isOwnerOfQuestion = async(question_id,user_id) =>  {
    try {
        const query = "SELECT user_id from question WHERE id = ?";
        const [rows] = await promisePool.query(query,[question_id]);
        return rows[0].user_id === user_id ;
    } catch(error) {
        console.log("error",error.message);
    }
}

// Function to fetch only media from either question_media or answer_media table by id
const getMediaById = async(res,id,type) => {
    try {
        if(type === "question") {
            const query = "SELECT media FROM question_media WHERE question_id = ?";
            const [rows] = await promisePool.query(query,[id]);
            return rows;
        } else if(type === "answer") {
            const query = "SELECT media FROM answer_media WHERE answer_id IN (SELECT id FROM answer WHERE question_id = ?)";
            const [rows] = await promisePool.query(query,[id]);
            return rows;
        }
    } catch (error) {
        console.log("error",error.message);
        res.status(500).send(error.message);
    }
} 

// This function is to check whether the loggin user is admin or owner of question or not
const isAdmin = async(user_id) => {
    try {
        const userQuery = "SELECT id FROM user WHERE user.user_type_id = 1";
        const [rows] = await promisePool.query(userQuery);
        return rows.some(row => row.id === user_id);
    } catch(error) {
        console.log("error",error.message);
    }
}
// Test-----------------------------------------------------------------------------
// Code reference https://stackoverflow.com/questions/68955426/how-to-merge-multiple-array-objects-with-the-same-key
// https://bobbyhadz.com/blog/javascript-remove-duplicates-from-array-of-objects
const filterUnique = (arr) => {
    const uniqueIds = [];
    const unique = arr.filter(element => {
        const isDuplicated = uniqueIds.includes(element.answer_id);
        if(!isDuplicated) {
            uniqueIds.push(element.answer_id);
            return true;
        }
        return false;
    })
    return unique;
}

const getAllQuestions = async() => {
    try {
        const questionQuery = "SELECT q.id,question_title,question_content,q.date as question_date,q.votes as question_votes,u.username as question_user,u.picture_name as question_user_picture,qt.tag as question_tag,qm.media as question_media,a.id as answer_id,a.answer_content,a.date as answer_date,a.votes as answer_votes,u1.username as answer_user, u1.picture_name as answer_user_picture, am.media as answer_media FROM question q INNER JOIN user u ON q.user_id = u.id INNER JOIN question_tag qt ON q.id = qt.question_id INNER JOIN question_media qm ON q.id = qm.question_id INNER JOIN answer a ON q.id = a.question_id INNER JOIN user u1 ON a.user_id = u1.id INNER JOIN answer_media am ON a.id = am.answer_id";
        const [rows] = await promisePool.query(questionQuery);
        const output = Object.values(rows.reduce((acc,cur) => {
            acc[cur.id] = acc[cur.id] || {
                id: cur.id, 
                question_title: cur.question_title,
                question_content:cur.question_content,
                question_date:cur.question_date,
                question_votes:cur.question_votes,
                question_user:cur.question_user,
                question_user_picture:cur.question_user_picture,
                question_tag: [], 
                question_media: [],
                answer: []
            };

            acc[cur.id].question_tag.push(cur.question_tag);
            acc[cur.id].question_tag = [...new Set(acc[cur.id].question_tag)];
            acc[cur.id].question_media.push(cur.question_media);
            acc[cur.id].question_media = [...new Set(acc[cur.id].question_media)];
            acc[cur.id].answer.push({
                answer_id:cur.answer_id,
                answer_content:cur.answer_content,
                answer_date:cur.answer_date,
                answer_votes:cur.answer_votes,
                answer_user:cur.answer_user,
                answer_user_picture:cur.answer_user_picture
            })
            acc[cur.id].answer.forEach(element => {
                element.ans
            })
            return acc;
        },{}));
        output.forEach (element => {
            element.answer = filterUnique(element.answer);
         })
        return output;
    } catch(error) {
        console.log("error",error.message);
    }
}
module.exports = {
    createQuestion,
    getAllQuestions,
    updateQuestionById,
    deleteQuestionById,
    getMediaById
}