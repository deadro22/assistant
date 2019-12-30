const express = require("express");
const router = express.Router();
const { questions, tags } = require("../DATABASE/MongoSetup");

router.get("/", async (req, res) => {
  try {
    if (!req.query.title)
      return res.status(500).send("No provided Question tag");
    const ftag = await tags.find().select("-_id tag");

    let searchTag = "";
    let utt = 0;
    let finalUtt = 0;
    let divTag = [];
    let tt = "";
    let test = "";
    let searchWords = req.query.title
      .replace(/\s\s+/, "")
      .toLowerCase()
      .split(" ");
    finalTag = [];
    ftag.forEach((tag, t_ind) => {
      searchWords.forEach((word, ind) => {
        utt = 0;
        for (i = 0; i < word.length; i++) {
          if (word[i] === tag.tag[i]) {
            utt++;
            if (finalUtt < utt) {
              finalUtt = utt;
              test = ftag[t_ind].tag;
              if (finalUtt >= 2) {
                if (finalTag.indexOf(tag.tag) === -1) {
                  divTag = tag.tag.split(" ");
                  finalTag.push(tag.tag);
                }
                tt = searchWords[ind + 1];
                if (divTag.length === 1) {
                  searchTag = finalTag.join(" ");
                } else {
                  utt = 0;
                  searchTag = divTag[0] + " " + divTag[1];
                }
              }
            }
          }
        }
      });
    });
    if (searchTag == "" || searchTag == null || searchTag === undefined)
      return res.status(404).send("Not found");
    const qst = await questions
      .findOne({
        tag: { $regex: searchTag, $options: "i" }
      })
      .select("-voice");
    if (qst == null) return res.status(404).send("Not found");
    res.send(qst);
  } catch (e) {
    res.status(500).send("There was an error");
    console.log(e);
  }
});

module.exports = router;
