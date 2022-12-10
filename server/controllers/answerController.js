"use strict";
const {createAnswer} = require("../models/answerModel");
const {validationResult} = require("express-validator");
const answerModel = require('../models/answerModel');
const questionModel = require('../models/questionModel');

const addAnswer = async(req,res) => {
    const user_id = req.user.id;
    const errors = validationResult(req)
    if(!req.files.length) {
        res.status(400).json({message:"File is missing or invalid"});
    } else if(errors.isEmpty()){
        const answer = req.body;
        answer.date = new Date();
        answer.user_id = user_id;
        answer.question_id = req.params.question_id;
        answer.media = req.files.map(file => file.filename);
        const result = await createAnswer(res,answer);
        if(result && result.affectedRows > 0) {
            res.status(201).json({message: "Answer is added successfully"});
        } else {
            res.status(400).json({message:"Answer adding failed"});
        }
    } else {
        console.log("Validation errors",errors);
        res.status(406).json({message:"Input validation error",errors:errors.array()});
    }
}

const getVoteNumber = async(req, res) => {
    const voteNumber = await questionModel.getVoteNumber(res, req.params.answer_id);
    if(voteNumber) {
        res.status(201).json(voteNumber);
    } else {
        res.status(401).json({message:"Error with getting the votes"});
    }
}

const getAllAnswerByUser = async(req, res) => {
    const answerByUser = await answerModel.getAnswerByUser(res, req);
    if(answerByUser) {
        res.status(201).json(answerByUser);
    } else {
        res.status(401).json({message:"Error with getting the answers"});
    }
}

module.exports = {
    addAnswer,
    getVoteNumber,
    getAllAnswerByUser
}