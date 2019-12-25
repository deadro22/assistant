const mongoose = require("mongoose");

const question = new mongoose.Schema({
  tag: { type: String, required: true },
  title: { type: String, required: true, lowercase: true },
  definition: { type: String, required: true },
  link: { type: String },
  image: { type: String },
  voice: { type: String, required: true }
});
const tag = mongoose.Schema({
  tag: { type: String, required: true, lowercase: true }
});
const upload = mongoose.Schema({
  contentType: { type: String, required: true, lowercase: true },
  path: { type: String, required: true, lowercase: true }
});
const questions = mongoose.model("questions", question);
const tags = mongoose.model("tags", tag);
const uploads = mongoose.model("uploads", upload);
module.exports.questions = questions;
module.exports.tags = tags;
module.exports.uploads = uploads;
