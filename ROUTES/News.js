const express = require("express");
const router = express.Router();

router.get("/news", (req, res) => {});
router.get("/new/:newsId", (req, res) => {});
router.post("/news", (req, res) => {});

module.exports = router;
