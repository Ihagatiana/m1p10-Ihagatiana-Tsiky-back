const express = require("express");
const router = express.Router();
const appservicesService = require('./appservices.service');
const appservicesModel = require('./appservices.model');

router.get("/",async (req, res) => {
    try {
      const appservices = await appservicesService.findAll({
        limit: req.query?.limit,
        offset: req.query?.offset,
      });
      res.status(200).json(appservices);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}); 

router.get("/:id",async (req, res) => {
  const appservicesId = req.params.id;
  try {
    const appservices =  await appservicesService.findById({ _id: appservicesId });
    res.status(200).json(appservices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/",async (req, res) => {

  const appointmentData = {
    date: req.body.date,
    clients: req.body.clients,
    startimes: req.body.startimes,
    state : 1
  }
  const appServiceData = {
    date: req.body.date,
    clients: req.body.clients,
    state : 1
  }

  try {

    const appservices =  await appservicesService.findById({ _id: appservicesId });
    res.status(200).json(appservices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/*
    const otherServiceData = {
      name: req.body.name,
      price: req.body.price,
      duration: req.body.duration,
      comission:req.body.comission,
      description: req.body.description,
    };
*/

module.exports = router;