"use strict";
const {validationResult} = require("express-validator");
const tagModel = require('../models/tagModel');

const getAllUserTags = async(req, res) => {
    const allTags = await tagModel.getUserTags(res, req);
    if(allTags) {
        res.status(201).json(allTags);
    } else {
        res.status(401).json({message:"Error with getting the tags"});
    }
}

const getAllTags = async(req, res) => {
    const allTags = await tagModel.getTags(res, req);
    if(allTags) {
        res.status(201).json(allTags);
    } else {
        res.status(401).json({message:"Error with getting the tags"});
    }
}

module.exports = {
    getAllUserTags,
    getAllTags
}
