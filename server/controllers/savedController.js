const {addQuestionToFavourite, getSavedQuestionByUserId, questionMarkedByUser, removeQuestionFromFavourite } = require("../models/savedModel");

const addFavourite = async(req,res) => {
    const result = await addQuestionToFavourite(res,req.body);
    if(result && result.affectedRows > 0) {
        res.status(201).json({message:"Question is marked as favourite"});
    } else {
        res.status(401).json({message:"Error with marking question as favourite"});
    }
}

const getFavouritesByUser = async(req,res) => {
    const favourites = await getSavedQuestionByUserId(res, req.params.user_id);
    if(favourites) {
        res.status(201).json(favourites);
    } else {
        res.status(401).json({message:"Errors with getting all favourites"});
    }
} 

const checkQUestionMarkedByUser = async(req,res) => {
    const result = await questionMarkedByUser(res,req.params.question_id,req.params.user_id);
    if (result) {
        res.status(201).json({question_exist: result});
    } else  {
        res.status(201).json({question_exist: result});
    }
}

const removeFavourite = async(req,res) => {
    const result = await removeQuestionFromFavourite(res,req.params.question_id, req.params.user_id);
    if(result && result.affectedRows > 0) {
        res.status(201).json({message:"Question is removed from favourite"});
    }else {
        res.status(401).json({message:"Error with removing question from favourite"});
    }
}

module.exports = {
    addFavourite,
    getFavouritesByUser,
    checkQUestionMarkedByUser,
    removeFavourite
}