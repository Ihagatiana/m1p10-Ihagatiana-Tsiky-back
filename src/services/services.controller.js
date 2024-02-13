const express = require("express");
const router = express.Router();
const servicesService = require('./services.service');
const servicesModel = require('./services.model');
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
 

router.post("/", upload.array('photos'), async (req, res) => {
  const { name, price, duration, description, road } = req.body;
  const roadArray = road || [];
  const photos = req.files ? req.files.map(file => file.path) : []; 
  try {
    const newService = new servicesModel({ name, price, duration, description, road: roadArray, photos });
    const isUnique = await servicesModel.findOne({ name });
    if (isUnique) {
      res.status(409).json({ message: 'Service with this name already exists' });
    }
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", upload.array('photos'), async (req, res) => {
  const serviceId = req.params.id;
  const updateData = req.body;
  const photos = req.files ? req.files.map(file => file.path) : [];
  updateData.road = updateData.road || [];
  updateData.photos = photos;
  try {
    const updatedService = await servicesModel.findByIdAndUpdate(serviceId, updateData, { new: true });
    if (updatedService) {
      res.status(200).json(updatedService);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.delete("/:id", async (req, res) => {
  const serviceId = req.params.id;
  try {
    const deletedService = await servicesModel.deleteOne(serviceId);
    if (deletedService) {
      res.status(200).json({ message: 'Service deleted successfully' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;