const express = require("express");
const router = express.Router();
const multer = require("multer");
const questionController = require("../controllers/questionController");
const answerController = require("../controllers/answerController");
const {body} = require("express-validator")
// FIle filter for image types
const fileFilter = (req,file,cb) => {
    const acceptedTypes = ["image/jpeg","image/png","image/gif"];
    if(acceptedTypes.includes(file.mimetype)){
        cb(null,true);
    } else {
        cb(null,false);
    }
}
const upload = multer({dest:"uploads/",fileFilter});
router.route("/")
    .post(
        upload.array("media",10),
        body("question_title").isLength({min:1}).trim().escape(),
        body("question_content").isLength({min:5}).trim().escape(),
        body("question_tag").isLength({min:1}).trim().escape(),
        questionController.addQuestion
    )
    .get(questionController.getQuestions)

router.route("/:question_id")
    .put(
        body("question_title").isLength({min:1}).trim().escape(),
        body("question_content").isLength({min:5}).trim().escape(),
        questionController.modifyQuestionById
    )
    .delete(questionController.removeQuestionById)
    .get(questionController.readQuestionById)

router.route("/:question_id/answer")
    .post(
        upload.array("media",10),
        body("answer_content").isLength({min:5}).trim().escape(),
        answerController.addAnswer
    )

module.exports = router;