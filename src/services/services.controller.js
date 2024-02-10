const express = require("express");
const router = express.Router();
const servicesService = require('./services.service');

router.get("/",async (req, res) => {
    try {
      const services = await servicesService.getAll();
      res.status(200).json(services);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.get("/:id",async (req, res) => {
  const servicesId = req.params.id;
  try {
    const services = await servicesService.findOne({ _id: servicesId });
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});







  module.exports = router;


  