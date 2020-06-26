const express = require("express");
const app = express();
const mongoose = require("mongoose");
const assistant = require("./ROUTES/Assistant");
const admin = require("./ROUTES/Admin");
const cors = require("cors");
const dotenv = require("dotenv");
const news = require("./ROUTES/News");
const stats = require("./ROUTES/Stats");
//const whitelist = ["https://ztassistant.herokuapp.com",];
/*const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};*/
dotenv.config();
//app.use(cors(corsOptions));
app.use(express.static("./javascript"));
app.use(express.static("./pages"));
app.set("view engine", "ejs");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("Connected");
  });

app.use("/req", assistant);
app.use("/", admin);
app.use("/admin/news", news);
app.use("/stats", stats);

app.get("*", (req, res) => {
  res.redirect("/admin/error");
});

app.listen(process.env.PORT || 80, () => {
  console.log("listening on port 80");
});
