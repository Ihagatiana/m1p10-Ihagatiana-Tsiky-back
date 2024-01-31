const express = require("express");
var app = express();

app.use("/auth", (req, res, next) => {
  const authModule = require("./src/auth");
  const router = authModule.controller;
  router(req, res, next);
});

app.use("/appointment", async (req, res, next) => {
  setTimeout(() => {
    const appointmentModule = require("./src/appointment");
    const router = appointmentModule.controller;
    router(req, res, next);
  }, 10000);
});

app.listen(3000, () => {
  console.log("Server is started on port 3000");
});
