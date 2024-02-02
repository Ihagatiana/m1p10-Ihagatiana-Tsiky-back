const express = require("express");
const router = express.Router();

const appointmentController = require("./appointment.controller");
const appointmentService = require("./appointment.service");

module.exports = {
  controller: appointmentController,
  service: appointmentService,
};
