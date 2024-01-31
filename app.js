const express = require("express");
var app = express();
const authModule = require("./src/auth");

app.use("/auth", authModule.controller);


app.listen(3000, () => {
  console.log("Server is started on port 3000");
});
