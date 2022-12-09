const express = require("express");
const router = express.Router();
const savedController = require("../controllers/savedController");

router.get("/:user_id", savedController.getFavouritesByUser);
router.post("/",savedController.addFavourite);
router.delete("/:user_id/:question_id",savedController.removeFavourite);
router.get("/:user_id/:question_id",savedController.checkQUestionMarkedByUser);

module.exports = router;