const express = require("express");
const passport = require("passport");
const router = express.Router();
const answerController = require("../controllers/answerController");

router.get("/", answerController.getAllAnswerByUser);

router.put('/:answer_id/votes', passport.authenticate('jwt', {session:false}),
answerController.updateAnswerVoteNumber);

module.exports = router;