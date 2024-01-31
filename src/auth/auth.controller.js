const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.send("Test for basic router");
});

module.exports = router;
