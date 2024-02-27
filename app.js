require("dotenv").config();
const db = require("./src/util/db.connect");
const express = require("express");
const app = express();
require("./src/util/images/images.model");
const cron = require("node-cron");
const email = require("./src/email/email.services");
const moment = require("moment-timezone");
const multer = require("multer");
const upload = multer();
//app.use(upload.none());

async function initializeApp() {
  try {
    await db.connectToDatabase();
    app.use(express.json());
    app.use(express.static("./"));

    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Credentials", true);
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept , authorization "
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      next();
    });

    moment.tz.setDefault("Indian/Antananarivo");

    cron.schedule("17 12 * * *", async () => {
      try {
        await email.sendmail();
      } catch (error) {
        console.error(
          "Erreur lors de la vérification des rendez-vous et de l'envoi des e-mails :",
          error
        );
      }
    });

    app.use("/auth", (req, res, next) => {
      const authModule = require("./src/auth");
      const router = authModule.controller;
      router(req, res, next);
    });

    app.use("/appointments", async (req, res, next) => {
      const appointmentsController = require("./src/appointments/appointments.controller");
      appointmentsController(req, res, next);
    });

    app.use("/email", async (req, res, next) => {
      const mailController = require("./src/email/email.controller");
      mailController(req, res, next);
    });

    app.use("/clients", async (req, res, next) => {
      const clientsController = require("./src/clients/clients.controller");
      clientsController(req, res, next);
    });

    app.use("/services", async (req, res, next) => {
      const servicesController = require("./src/services/services.controller");
      servicesController(req, res, next);
    });

    app.use("/appservices", async (req, res, next) => {
      const appservicesController = require("./src/appservices/appservices.controller");
      appservicesController(req, res, next);
    });

    app.use("/employes", async (req, res, next) => {
      const employesController = require("./src/employes/employes.controller");
      employesController(req, res, next);
    });

    app.use("/credentials", async (req, res, next) => {
      console.log("azerty");
      const credentialsController = require("./src/credentials/credentials.controller");
      credentialsController(req, res, next);
    });

    app.use("/statistics", async (req, res, next) => {
      const statisticsController = require("./src/statistics/statistics.controller");
      statisticsController(req, res, next);
    });

    app.listen(process.env.APP_PORT, () => {
      console.log(`Server is started on port ${process.env.APP_PORT}`);
    });
  } catch (error) {
    console.error("Error initializing the app:", error.message);
  }
}

initializeApp();
