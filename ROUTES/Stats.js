const express = require("express");
const { stats } = require("../DATABASE/MongoSetup");
const router = express.Router();

router.get("/global/data", async (req, res) => {
  const sdt = await stats.find().populate("question", "title");
  res.send(sdt);
});
router.get("/global", async (req, res) => {
  res.render("../pages/Stats.ejs");
});
router.post("/:qstId/views", async (req, res) => {
  const questionStat = await stats.findOne({ question: req.params.qstId });
  if (!questionStat) return res.status(404).send("Could not find question");
  const bQst = req.body.selectedQuestions;
  const tqQues = [...questionStat.subViews];
  for (let i = 0; i < bQst.length; i++) {
    tqQues[bQst[i]]++;
  }
  questionStat.subViews = tqQues;
  await questionStat.save();
  res.send(questionStat);
});
module.exports = router;
