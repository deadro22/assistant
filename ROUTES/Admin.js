const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploads, questions, tags } = require("../DATABASE/MongoSetup");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

router.get("/dashboard", (req, res) => {
  res.render("../Renders/admin.ejs");
});

router.post(
  "/uploadQuestion",
  upload.single("myFile"),
  async (req, res, next) => {
    console.log(req.body);
    if (req.body.title == "" || req.body.def == "" || req.body.tag == "")
      return res.status(500).send("Error creating your question");
    const checkQst = await questions.findOne({ title: req.body.title });
    if (checkQst) return res.status(500).send("Error creating your question");
    const checkTag = await tags.findOne({ tag: req.body.tag });
    if (checkTag) return res.status(500).send("Error creating your question");
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    const qst = new questions({
      tag: req.body.tag,
      title: req.body.title,
      definition: req.body.def,
      link: req.body.link,
      image: req.body.image,
      voice: req.file.path
    });
    const tag = new tags({
      tag: req.body.tag
    });
    const savedQst = await qst.save();
    const savedTag = await tag.save();
    res.send("Question created successfuly " + savedQst);
  }
);

module.exports = router;
