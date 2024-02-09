const express = require("express");
const router = express.Router();
const serviceService = require('./service.service');
const mongoose = require('mongoose'); 


  router.get("/",async (req, res) => {
      try {
        console.log('Ato');
        const services = await serviceService.getAllServices();
        console.log(services);
        res.status(200).json(services);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
  });

  module.exports = router;


  