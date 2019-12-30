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
    let secUtt = 0;
    let searchWords = req.query.title
      .replace(/\s\s+/, "")
      .toLowerCase()
      .split(" ");
    searchWords.forEach((word, ind) => {
      ftag.forEach(tag => {
        let j_tag = tag.tag.split(" ");
        j_tag.forEach(jtag => {
          for (i = 0; i < word.length; i++) {
            if (word[i] === jtag[i]) {
              utt++;
              if (finalUtt < utt) {
                finalUtt = utt;
                utt = 0;
                if (finalUtt > 1) {
                  if (j_tag.length == 1) {
                    searchTag = tag.tag;
                  } else {
                    let tt = searchWords[ind] + " " + searchWords[ind + 1];
                    for (i = 0; i < tt.length; i++) {
                      if (tt[i] === tag.tag[i]) {
                        utt++;
                        if (secUtt < utt) {
                          secUtt = utt;
                          utt = 0;
                          if (secUtt > 1) {
                            if (secUtt > finalUtt) {
                              searchTag = tag.tag;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        });
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
