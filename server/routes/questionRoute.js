const express = require("express");
const router = express.Router();
const multer = require("multer");
const questionController = require("../controllers/questionController");
const answerController = require("../controllers/answerController");
const passport = require('../utils/passport');
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
router.get("/", questionController.getQuestions)
router.post("/", passport.authenticate('jwt', {session: false}),
    upload.array("media",10),
    body("question_title").isLength({min:1}).trim().escape(),
    body("question_content").isLength({min:5}).trim().escape(),
    body("question_tag").isLength({min:1}).trim().escape(),
    questionController.addQuestion,
)

router.put("/:question_id",passport.authenticate('jwt', {session: false}),
    body("question_title").isLength({min:1}).trim().escape(),
    body("question_content").isLength({min:5}).trim().escape(),
    questionController.modifyQuestionById
)
router.delete("/:question_id",
    passport.authenticate('jwt', {session: false}),
    questionController.removeQuestionById)

router.get("/byuser", 
    passport.authenticate('jwt', {session: false}),
    questionController.getAllQuestionByUser
 )

router.get("/:question_id",
    passport.authenticate('jwt', {session: false}),
    questionController.readQuestionById)

router.post("/:question_id/answer", 
    passport.authenticate('jwt', {session: false}),
    upload.array("media",10),
    body("answer_content").isLength({min:5}).trim().escape(),
    answerController.addAnswer,
)

router.put('/:question_id/votes', 
passport.authenticate('jwt', {session:false}),
questionController.updateQuestionVoteNumber);

module.exports = router;