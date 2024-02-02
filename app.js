require("dotenv-flow").config();
const express = require("express");
const app = express();

app.use("/auth", (req, res, next) => {
  const authModule = require("./src/auth");
  const router = authModule.controller;
  router(req, res, next);
});

app.use("/appointment", async (req, res, next) => {
  const appointmentModule = require("./src/appointment");
  const router = appointmentModule.controller;
  router(req, res, next);
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is started on port ${process.env.APP_PORT}`);
});
