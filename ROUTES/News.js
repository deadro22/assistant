const express = require("express");
const router = express.Router();
const { news } = require("../DATABASE/MongoSetup");
const os = require("os");

router.get("/", async (req, res) => {
  const f_news = await news.find().select("-image");
  res.render("../pages/listNews.ejs", { f_news });
});
router.get("/manage", (req, res) => {
  res.render("../pages/gererActu.ejs");
});
router.get("/:newsId", async (req, res) => {
  const f_news = await news.findOne({ _id: req.params.newsId });
  if (!f_news) return res.status(404).send("Not Found");
  res.render("../pages/infoNews.ejs", { f_news });
});
router.get("/:newsId/image", async (req, res) => {
  try {
    const resImage = await news
      .findOne({ _id: req.params.newsId })
      .select("image");
    if (!resImage) return res.redirect("/admin/error");
    res.contentType(resImage.image.img_Type);
    res.send(resImage.image.img);
  } catch (e) {
    console.log(e);
    res.redirect("/admin/error");
  }
});
router.post("/", async (req, res) => {
  try {
    if (req.body.title == "" || req.body.content == "")
      return res.redirect("/admin/error");
    const checkNews = await news.findOne({ title: req.body.title });
    if (checkNews) return res.redirect("/admin/error");
    const up_image = JSON.parse(req.body.thumb);
    const n_news = new news({
      title: req.body.title,
      definition: req.body.content,
      image: {
        img: new Buffer.from(up_image.data, "base64"),
        img_Type: up_image.type,
      },
    });
    const up_N_news = await n_news.save();
    res.redirect("/admin/news/" + up_N_news._id);
  } catch (error) {
    console.log(error);
    res.redirect("/admin/error");
  }
});
router.get("/:id/delete", async (req, res) => {
  try {
    const deleteNews = await news.findOne({ _id: req.params.id });
    if (!deleteNews) return res.redirect("/admin/error");
    await news.deleteOne({ _id: req.params.id });
    res.redirect("/admin/news");
  } catch (e) {
    res.redirect("/admin/error");
  }
});
router.post("/delete", async (req, res) => {
  try {
    if (!req.body.title) return res.status(405).redirect("/admin/news/manage");
    const deleteNews = await news.findOne({ title: req.body.title });
    if (!deleteNews) return res.redirect("/admin/error");
    await news.deleteOne({ title: req.body.title });
    res.redirect("/admin/news");
  } catch (e) {
    res.redirect("/admin/error");
  }
});
module.exports = router;
