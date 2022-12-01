"use strict";
const {createQuestion,getAllQuestions, updateQuestionById} = require("../models/questionModel");

const addQuestion = async(req,res) => {
    // TODO : Assume user_id = 1 is test user, will replace with req.user.id
    const user_id = 10;
    if(!req.files) {
        res.status(400).json({message:"File is missing or invalid"});
    } else {
        const question = req.body;
        question.date = new Date();
        question.question_tag = question.question_tag.split(",");
        question.user_id = user_id;
        question.media = req.files.map(file => file.filename);
        console.log("Media file should be",question.media);
        const result = await createQuestion(res,question);
        if(result && result.affectedRows > 0) {
            res.status(201).json({message: "Question is added successfully"});
        } else {
            res.status(400).json({message:"Question adding failed"});
        }
    }
}

const getQuestions = async(req,res) => {
    const questions = await getAllQuestions();
    if(questions) {
        res.status(201).json(questions);
    }
}

const modifyQuestionById = async(req,res) => {
    // TODO: Assume user_id is a test user, will replace with actual req.user.id
    const user_id = 10;
    const questionToUpdate = req.body;    
    questionToUpdate.id = req.params.question_id;
    questionToUpdate.user_id = user_id;
    const result = await updateQuestionById(res,questionToUpdate);
    if(result && result.affectedRows > 0) {
        res.status(201).json({message: "Question is modified successfully"})
    } else {
        res.status(400).json({message:"Question modification failed"})
    }
}

module.exports = {
    addQuestion,
    getQuestions,
    modifyQuestionById
}
