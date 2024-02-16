require("dotenv").config();
const db = require('./src/util/db.connect');
const express = require("express");
const app = express();
require("./src/util/images/images.model");

const multer = require('multer');
const upload = multer();
app.use(upload.none());


async function initializeApp() {
  try {
    await db.connectToDatabase(); 
    app.use(express.json());
    //app.use(express.static('./src/util/images/uploads'));
    app.use('./src/util/images/uploads');
    app.use(express.static('./src/util/images/uploads'));

    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Credentials", true);
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , authorization ");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      next();
    });

    app.use("/auth", (req, res, next) => {
      const authModule = require("./src/auth");
      const router = authModule.controller;
      router(req, res, next);
    });

    app.use("/services", async (req, res, next) => {
      const servicesController = require("./src/services/services.controller");
      servicesController(req, res, next);
    });

    app.use("/employes", async (req, res, next) => {
      const employesController = require("./src/employes/employes.controller");
      employesController(req, res, next);
    });

    app.use("/credentials", async (req, res, next) => {
      const credentialsController = require("./src/credentials/credentials.controller");
      credentialsController(req, res, next);
    });

    app.listen(process.env.APP_PORT, () => {
      console.log(`Server is started on port ${process.env.APP_PORT}`);
    });
  } catch (error) {
    console.error('Error initializing the app:', error.message);
  }
}

initializeApp();