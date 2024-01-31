const express = require("express");
var app = express();
const authModule = require("./src/auth");
const authService = authModule.service;
app.use("/auth", authModule.router);
authService.test();
app.listen(3000, () => {
  console.log("Server is started on port 3000");
});
