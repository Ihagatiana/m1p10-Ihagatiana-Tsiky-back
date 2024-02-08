const express = require("express");
const router = express.Router();
const serviceService = require('./service.service');
const mongoose = require('mongoose'); 

  router.get("/", (req, res, next) => {
    res.send("Appointment base route");
  });

  router.get("/all",async (req, res) => {
      try {
        console.log('Ato');
        const services = await serviceService.getAllServices();
        console.log(services);
        res.status(200).json(services);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
  });
  router.get('/collections', async (req, res) => {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(collection => collection.name);
      res.json({ collections: collectionNames });
    } catch (error) {
      console.error('Error listing collections:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;


  