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
  const {} = req.body;
  try {
    const appservices =  await appservicesService.findById({ _id: appservicesId });
    res.status(200).json(appservices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;