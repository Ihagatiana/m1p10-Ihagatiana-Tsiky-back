const express = require("express");
const router = express.Router();
const offresServices = require('./offres.service');
const offresModel = require('./offres.model');

router.get("/", async (req, res) => {
    try {
      const offres = await offresServices.findAll({
        limit: req.query?.limit,
        offset: req.query?.offset,
      });
      res.status(200).json(offres);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  router.get("/:id", async (req, res) => {
    const offresId = req.params.id; 
    console.log(offresId);
    try {
      const offres = await offresServices.findById(offresId);
      res.status(200).json(offres);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

router.post("/",async (req, res) => {
    const offresData = {
      date: req.body.date, 
      services: req.body.services,
      percentage: req.body.percentage
    }
    try {
      const offresservices =  await offresServices.create(offresData);
      res.status(200).json(offresservices);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });

  module.exports = router;