const express = require("express");
const router = express.Router();
const multer = require("multer");
const questionController = require("../controllers/questionController");
const answerController = require("../controllers/answerController");

const upload = multer({dest:"uploads/"});
router.route("/")
    .post(
        upload.array("media",10),
        questionController.addQuestion
    )
    .get(questionController.getQuestions)

router.route("/:question_id")
    .put(questionController.modifyQuestionById)
    .delete(questionController.removeQuestionById)
    .get(questionController.readQuestionById)

router.route("/:question_id/answer")
    .post(
        upload.array("media",10),
        answerController.addAnswer
    )

module.exports = router;