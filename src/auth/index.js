const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const authService = require("./auth.service");
router.use(authController);

module.exports = { controller: router, service: authService };
