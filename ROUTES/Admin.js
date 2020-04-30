const express = require("express");
const router = express.Router();
const { questions, tags } = require("../DATABASE/MongoSetup");
const acceptedTypes = ["audio/mp3"];

router.get(["/admin/question", "/", "/admin"], (req, res) => {
  res.render("../pages/gererQuestion.ejs");
});

router.get("/admin/question/:id", async (req, res) => {
  try {
    if (!req.params.id) return res.redirect("/admin/error");

    const qst = await questions
      .findOne({ _id: req.params.id })
      .select("-voice");
    if (!qst) return res.redirect("/admin/error");
    res.render("../pages/infoQuestion.ejs", { qst });
  } catch (e) {
    res.redirect("/admin/error");
  }
});

router.get("/admin/list-question", async (req, res) => {
  try {
    const f_qst = await questions.find().select("-voice");
    res.render("../pages/listQuestion.ejs", { f_qst });
  } catch (e) {
    res.redirect("/admin/error");
  }
});
router.get("/voice/:id", async (req, res) => {
  const result = await questions.findOne({ _id: req.params.id });
  if (!result) return res.redirect("/admin/error");

  res.contentType(result.voice.vc_Type);
  res.send(result.voice.vc);
});
router.get("/admin/deleteQuestion/:id", async (req, res) => {
  try {
    if (!req.params.id || req.params.id == "")
      return res.redirect("/admin/error");
    const deleteQst = await questions.findOne({ _id: req.params.id });
    if (!deleteQst) return res.redirect("/admin/error");
    const dQst = await questions.deleteOne({ _id: req.params.id });
    const dtag = await tags.deleteOne({ tag: deleteQst.tag });
    res.redirect("/admin/question");
  } catch (e) {
    res.redirect("/admin/error");
  }
});
router.get("/admin/error", (req, res) => {
  res.render("../pages/error.ejs");
});
router.get("/admin/phone", (req, res) => {
  res.render("../pages/phone.ejs");
});
router.get("*", (req, res) => {
  res.redirect("/admin/error");
});

router.post("/admin/deleteQuestion", async (req, res) => {
  try {
    if (!req.body.tag || req.body.tag == "")
      return res.redirect("/admin/error");
    const deleteQst = await questions.findOne({ tag: req.body.tag });
    if (!deleteQst) return res.redirect(404, "/admin/error");
    const dQst = await questions.deleteOne({ tag: deleteQst.tag });
    const dtag = await tags.deleteOne({ tag: deleteQst.tag });
    res.redirect("/admin/list-question");
  } catch (e) {
    return res.redirect("/admin/error");
  }
});

router.post("/admin/uploadQuestion", async (req, res, next) => {
  try {
    if (req.body.title == "" || req.body.def == "" || req.body.tag == "")
      return res.redirect("/admin/error");

    const checkQst = await questions.findOne({ title: req.body.title });
    if (checkQst) return res.redirect("/admin/error");

    const checkTag = await tags.findOne({ tag: req.body.tag });
    if (checkTag) return res.redirect("/admin/error");
    const cover = JSON.parse(req.body.thumb);

    const qst = new questions({
      tag: req.body.tag,
      title: req.body.title,
      definition: req.body.def,
      link: req.body.link,
      image: req.body.image,
      voice: {
        vc: new Buffer.from(cover.data, "base64"),
        vc_Type: cover.type,
      },
    });
    const tag = new tags({
      tag: req.body.tag,
    });
    const savedQst = await qst.save();
    const savedTag = await tag.save();
    res.redirect("/admin/question/" + savedQst._id);
  } catch (error) {
    console.log(error);
    res.redirect("/admin/error");
  }
});

module.exports = router;
