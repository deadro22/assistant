const express = require("express");
const router = express.Router();
const { questions, tags } = require("../DATABASE/MongoSetup");
const Fuse = require("fuse.js");

router.get("/", async (req, res) => {
  try {
    if (!req.query.title)
      return res.status(500).send("No provided Question tag");
    const ftag = await tags.find().select("-_id tag");

    let searchTag = "";
    let utt = 0;
    let finalUtt = 0;
    let searchWords = req.query.title
      .replace(/\s\s+/, "")
      .toLowerCase()
      .split(" ");
    let hasDetails = false;
    finalTag = [];
    ftag.forEach((tag, t_ind) => {
      searchWords.forEach((word, ind) => {
        utt = 0;
        for (i = 0; i < word.length; i++) {
          if (word[i] === tag.tag[i]) {
            utt++;
            if (finalUtt < utt) {
              finalUtt = utt;
              if (finalUtt >= 4) {
                var options = {
                  shouldSort: true,
                  threshold: 0.6,
                  location: 0,
                  distance: 100,
                  maxPatternLength: 32,
                  minMatchCharLength: 1,
                  keys: ["tag"]
                };
                var fuse = new Fuse(ftag, options); // "list" is the item array
                let tTag = tag.tag.split(" ");
                if (tTag.length === 1) {
                  var result = fuse.search(searchWords[ind]);
                } else if (
                  tTag.length > 1 &&
                  searchWords[ind + 1] === undefined
                ) {
                  hasDetails = true;
                  searchTag = tTag[0];
                  break;
                } else {
                  var result = fuse.search(
                    searchWords[ind] + searchWords[ind + 1]
                  );
                }
                if (searchTag == "") {
                  searchTag = result[0].tag;
                  break;
                }
              }
            }
          }
        }
      });
    });
    if (searchTag == "" || searchTag == null || searchTag === undefined)
      return res.status(404).send("Not found");
    let qst;
    if (hasDetails) {
      qst = await questions
        .find({
          tag: { $regex: searchTag, $options: "i" }
        })
        .select("-voice");
    } else {
      qst = await questions
        .findOne({
          tag: { $regex: searchTag, $options: "i" }
        })
        .select("-voice");
    }
    if (qst == null) return res.status(404).send("Not found");
    res.send({ qst, hasDetails, searchTag });
  } catch (e) {
    res.status(500).send("There was an error");
    console.log(e);
  }
});

module.exports = router;
