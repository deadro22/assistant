const express = require("express");
const router = express.Router();
const { questions, tags } = require("../DATABASE/MongoSetup");

router.get("/", async (req, res) => {
  try {
    if (!req.query.title)
      return res.status(500).send("No provided Question tag");
    const ftag = await tags.find().select("-_id tag");
    let newTag = "";
    let searchTag = "";
    //simple search code
    /*ftag.forEach(tag => {
      if (req.query.title.toLowerCase().includes(tag.tag)) {
        newTag = tag.tag;
      }
    });*/
    //advanced search code
    let finalUtt = 0;
    ftag.forEach(tag => {
      newTag = req.query.title;
      let utt = 0;
      for (i = 0; i < newTag.length; i++) {
        if (newTag[i] == tag.tag[i]) {
          utt++;
          if (finalUtt < utt) {
            finalUtt = utt;
            if (finalUtt > 1) {
              searchTag = tag.tag;
            }
          }
        }
      }
    });
    if (searchTag == "" || searchTag == null)
      return res.status(404).send("Not found");
    console.log(searchTag);
    const qst = await questions.findOne({
      tag: { $regex: searchTag, $options: "i" }
    });
    if (qst == null) return res.status(404).send("Not found");
    res.send(qst);
  } catch (e) {
    res.status(500).send("There was an error");
    console.log(e);
  }
});

module.exports = router;
