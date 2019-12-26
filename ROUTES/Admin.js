const express = require("express");
const router = express.Router();
const { questions, tags } = require("../DATABASE/MongoSetup");
const acceptedTypes = ["audio/mp3"];

router.get("/dashboard", (req, res) => {
  res.render("../Renders/admin.ejs");
});

router.get("/voice/:id", async (req, res) => {
  const result = await questions.findOne({ _id: req.params.id });
  const link = `data:${
    result.voice.vc_Type
  };charset=utf-8;base64,${result.voice.vc.toString("base64")}`;
  res.contentType(result.voice.vc_Type);
  res.send(result.voice.vc);
});

router.post("/uploadQuestion", async (req, res, next) => {
  try {
    if (req.body.title == "" || req.body.def == "" || req.body.tag == "")
      return res.status(500).send("Error creating your question");
    const checkQst = await questions.findOne({ title: req.body.title });
    if (checkQst) return res.status(500).send("Error creating your question");
    const checkTag = await tags.findOne({ tag: req.body.tag });
    if (checkTag) return res.status(500).send("Error creating your question");
    const cover = JSON.parse(req.body.thumb);
    console.log(cover.type);
    if (cover == null || !acceptedTypes.includes(cover.type))
      return res.status(500).send("Type incorrect");

    const qst = new questions({
      tag: req.body.tag,
      title: req.body.title,
      definition: req.body.def,
      link: req.body.link,
      image: req.body.image,
      voice: {
        vc: new Buffer.from(cover.data, "base64"),
        vc_Type: cover.type
      }
    });
    const tag = new tags({
      tag: req.body.tag
    });
    const savedQst = await qst.save();
    const savedTag = await tag.save();
    res.send("Question created successfuly " + savedQst);
  } catch (error) {
    return res.status(500).send("something went wrong !");
  }
});

module.exports = router;
