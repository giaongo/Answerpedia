"use strict";
const {createAnswer} = require("../models/answerModel");

const addAnswer = async(req,res) => {
        // TODO : Assume user_id = 1 is test user, will replace with req.user.id
    const user_id = 1;
    if(!req.files) {
        res.status(400).json({message:"File is missing or invalid"});
    } else {
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
    }
}

module.exports = {
    addAnswer
}