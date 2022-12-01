"use strict";
const {createQuestion,getAllQuestions} = require("../models/questionModel");

const addQuestion = async(req,res) => {
    // Assume user_id = 1 is test user
    const user_id = 1;
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
        if(result) {
            res.status(201).json({message: "data is added into question, question_media and question_tag"})
        }
    }
}

const getQuestions = async(req,res) => {
    const questions = await getAllQuestions();
    if(questions) {
        res.status(201).json(questions);
    }
}

module.exports = {
    addQuestion,
    getQuestions
}
