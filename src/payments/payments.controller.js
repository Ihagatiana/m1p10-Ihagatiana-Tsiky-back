const express = require("express");
const router = express.Router();
const Payments = require('./payments.model');
const paymentsService = require('./payments.service');


router.get("/", async (req, res) => {
    try {
      const payments = await paymentsService.findAll({
        limit: req.query?.limit,
        offset: req.query?.offset,
      });
      res.status(200).json(payments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  router.get("/:id", async (req, res) => {
    const paymentsId = req.params.id;
    try {
      const payments = await paymentsService.findById({ _id: paymentsId });
      res.status(200).json(payments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  router.post("/",async (req, res) => {
    try {
      const { date ,client,appservices} = req.body;
      const newPayments = await paymentsService.create(date,client,appservices);
      res.status(201).send(newPayments);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  });

module.exports = router;