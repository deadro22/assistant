const express = require("express");
const app = express();
const mongoose = require("mongoose");
const assistant = require("./ROUTES/Assistant");
const admin = require("./ROUTES/Admin");
const cors = require("cors");

var whitelist = ["http://localhost:8081"];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};
//app.use(cors(corsOptions));
app.use(express.json());
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

app.use("/uploads", express.static("uploads"));
app.use("/req", assistant);
app.use("/", admin);

app.listen(process.env.PORT || 80, () => {
  console.log("listening on port 80");
});
