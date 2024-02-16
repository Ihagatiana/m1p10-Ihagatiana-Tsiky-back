  const express = require("express");
  const router = express.Router();
  const servicesService = require('./services.service');
  const multer = require('multer');

  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage }); 

  router.get("/",async (req, res) => {
      try {
        const services = await servicesService.findAll({});
        res.status(200).json(services);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
  });

  router.get("/:id",async (req, res) => {
    const servicesId = req.params.id;
    try {
      const services =  await servicesService.findById({ _id: servicesId });
      res.status(200).json(services);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post('/', upload.array('photos'), async (req, res) => {
    try {
      const { name, price, duration, description } = req.body;
      const imageBuffers = req.files ? req.files.map(file => file.buffer) : null;
      const files = req.files; 
      const newService = await servicesService.create(name, price, duration, description, imageBuffers,files);
      res.status(201).send(newService);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  });

  router.put("/:id", upload.array('photos'), async (req, res) => {
    try {
      const serviceId = req.params.id;
      const imagesBuffers = req.files ? req.files.map(file => file.buffer) : null; 
      const otherServiceData = {
        name: req.body.name,
        price: req.body.price, 
        duration: req.body.duration,
        description: req.body.description
      };
      const file = req.files;
      const updatedService =  await servicesService.updateById(serviceId, imagesBuffers, otherServiceData, file);
      res.status(200).send(updatedService);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    const serviceId = req.params.id;
    try {
      const result = await servicesService.deleteById(serviceId);
      if (result.error) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;