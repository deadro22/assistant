const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, lowercase: true },
  definition: { type: String, required: true },
  image: {
    img: { type: Buffer },
    img_Type: { type: String },
  },
});

const SearchStat = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "questions",
  },
  views: {
    type: Number,
    default: 0,
  },
  subViews: { type: Array, default: [0, 0, 0, 0, 0, 0] },
});

const question = new mongoose.Schema({
  tag: { type: String, required: true },
  title: { type: String, required: true, lowercase: true },
  definition: [{ type: String, required: true }],
  link: { type: String },
  image: { type: String },
  voice: [
    {
      vc: { type: Buffer },
      vc_Type: { type: String },
    },
  ],
});
const tag = mongoose.Schema({
  tag: { type: String, required: true, lowercase: true },
});

const questions = mongoose.model("questions", question);
const tags = mongoose.model("tags", tag);
const news = mongoose.model("news", newsSchema);
const stats = mongoose.model("stats", SearchStat);

module.exports.questions = questions;
module.exports.tags = tags;
module.exports.news = news;
module.exports.stats = stats;
