const express = require("express");
const router = express.Router();
const credentialsService = require('./credentials.service');
const credentialsModel = require('./credentials.model');

router.get("/",async (req, res) => {
    try {
      const credentials = await credentialsService.findAll({});
      res.status(200).json(credentials);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.get("/:id",async (req, res) => {
  const credentialsId = req.params.id;
  try {
    const credentials =  await credentialsService.findById({ _id: credentialsId });
    res.status(200).json(credentials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', async (req, res) => {
    try {
      const newCredentials = await credentialsService.create(req.body);
      res.status(200).send(newCredentials);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
      const updatedCredentials = await credentialsService.updateById(req.params.id, req.body);
      res.status(200).send(updatedCredentials);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const credentialsId = req.params.id;
    try {
      await credentialsService.deleteById(credentialsId);
      res.status(200).json({ message: 'Credential deleted successfully' });
    } catch (error) {
      console.error('Error deleting Credential:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;