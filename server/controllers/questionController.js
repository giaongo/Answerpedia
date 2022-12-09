"use strict";
const {createQuestion,getAllQuestions, updateQuestionById, getMediaById, deleteQuestionById, getQuestionById} = require("../models/questionModel");
const {unlink}  = require("node:fs");
const {validationResult} = require("express-validator");
const questionModel = require('../models/questionModel');


const addQuestion = async(req,res) => {
    const user_id = req.user.id;
    const errors = validationResult(req);
    if(!req.files.length) {
        res.status(400).json({message:"File is missing or invalid"});
    } else if(errors.isEmpty()){
        const question = req.body;
        question.date = new Date();
        question.question_tag = question.question_tag.split(",");
        question.user_id = user_id;
        question.media = req.files.map(file => file.filename);
        const result = await createQuestion(res,question);
        if(result && result.affectedRows > 0) {
            res.status(201).json({message: "Question is added successfully"});
        } else {
            res.status(400).json({message:"Question adding failed"});
        }
    } else {
        console.log("Validation errors",errors.array());
        res.status(406).json({message:"Input validation error",errors:errors.array()});
    }
}

const getQuestions = async(req,res) => {
    const questions = await getAllQuestions(res);
    if(questions) {
        res.status(201).json(questions);
    } else {
        res.status(401).json({message:"Error with getting all questions"});
    }
}

const readQuestionById = async(req,res) => {
    const question = await getQuestionById(res,req.params.question_id);
    if(question) {
        res.status(201).json(question);
    } else {
        res.status(401).json({message:"Error with getting the question"});
    }
}
const modifyQuestionById = async(req,res) => {
    const user_id = req.user.id;
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        const questionToUpdate = req.body;    
        questionToUpdate.id = req.params.question_id;
        questionToUpdate.user_id = user_id;
        const result = await updateQuestionById(res,questionToUpdate);
        if(result && result.affectedRows > 0) {
            res.status(201).json({message: "Question is modified successfully"})
        } else {
            res.status(400).json({message:"Question modification failed"})
        }
    } else {
        console.log("data is", req.body);
        console.log("errors", errors.array());
        res.status(406).json({message:"Input validation errors",errors:errors.array()});
    }

}

const removeQuestionById = async(req,res) => {
    const user_id = req.user.id;
    const question_id = req.params.question_id;
    const questionMedia = await getMediaById(res,question_id,"question");
    const answerMedia = await getMediaById(res,question_id,"answer");
    const deleteQuestionResult =  await deleteQuestionById(res,question_id,user_id);
    console.log("delete question result",deleteQuestionResult);
    if(deleteQuestionResult && deleteQuestionResult.affectedRows > 0) {
        await removeMediaFromUploads(questionMedia, answerMedia)
        res.status(201).json({message: "Question is deleted successfully"})
    } else {
        res.status(400).json({message:"Question deletion failed"})
    }
}

const removeMediaFromUploads = async(questionMedia, answerMedia) => {
    if(questionMedia.length > 0 || answerMedia.length > 0) {
        questionMedia
        .concat(answerMedia)
        .forEach(filename => {
            const uploadLinkToDelete = "../server/uploads/" + filename.media;
            unlink(uploadLinkToDelete,(err) => {
                if(err) {
                    console.log("error is",err);
                    throw err;
                }
            })
        })
    } 
}

const incrementQuestionVoteNumber = async(req, res) => {
    const incrementedQuestionVoteNumber = await questionModel.incrementQuestionVoteNumber(res, req.params.id);
    if(incrementedQuestionVoteNumber) {
        res.status(201).json(voteNumber);
    } else {
        res.status(401).json({message:"Error with incrementing the votes"});
    }
}


const decrementQuestionVoteNumber = async(req, res) => {
    const decrementedQuestionVoteNumber = await questionModel.decrementQuestionVoteNumber(res, req.params.id);
    if(decrementedQuestionVoteNumber) {
        res.status(201).json(voteNumber);
    } else {
        res.status(401).json({message:"Error with decrementing the votes"});
    }
}
module.exports = {
    addQuestion,
    getQuestions,
    modifyQuestionById,
    removeQuestionById,
    readQuestionById,
    decrementQuestionVoteNumber,
    incrementQuestionVoteNumber
}
