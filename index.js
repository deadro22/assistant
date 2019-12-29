const express = require("express");
const app = express();
const mongoose = require("mongoose");
const assistant = require("./ROUTES/Assistant");
const admin = require("./ROUTES/Admin");

app.use(express.static("./javascript"));
app.use(express.static("./pages"));
app.set("view engine", "ejs");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

mongoose
  .connect(
    "mongodb://heroku_gs4984rm:qv5fa96u48efobbrs1u253bs1t@ds111066.mlab.com:11066/heroku_gs4984rm",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(conn => {
    console.log("Connected");
  });

app.use("/req", assistant);
app.use("/admin", admin);

app.listen(process.env.PORT || 80, () => {
  console.log("listening on port 80");
});
