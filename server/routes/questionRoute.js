const express = require("express");
const router = express.Router();
const multer = require("multer");
const questionController = require("../controllers/questionController");

const upload = multer({dest:"uploads/"});
router.route("/")
    .post(
        upload.array("media",10),
        questionController.addQuestion
    )
    .get(questionController.getQuestions)

module.exports = router;