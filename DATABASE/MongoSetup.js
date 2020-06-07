const mongoose = require("mongoose");

const question = new mongoose.Schema({
  tag: { type: String, required: true },
  title: { type: String, required: true, lowercase: true },
  definition: [{ type: String, required: true }],
  link: { type: String },
  image: { type: String },
  voice: 
    {
      vc: { type: Buffer, required: true },
      vc_Type: { type: String, required: true },
    },
  ,
});
const tag = mongoose.Schema({
  tag: { type: String, required: true, lowercase: true },
});

const questions = mongoose.model("questions", question);
const tags = mongoose.model("tags", tag);

module.exports.questions = questions;
module.exports.tags = tags;
