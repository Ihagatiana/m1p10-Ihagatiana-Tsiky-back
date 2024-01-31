const express = require("express");
const router = express.Router();
const service = require("./auth.service");
const authController = require("./auth.controller");
router.use(authController);

exports.controller = router;
exports.service = service;
