const express = require("express");
const router = express.Router();
const CredentialsServices = require('./credentials.service');
const Credentials = require('./credentials.model');

router.get("/",async (req, res) => {
    try {
      const CredentialsData = await CredentialsServices.findAll({});
      res.status(200).json(CredentialsData);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.get("/:id",async (req, res) => {
  try {
    const CredentialsData =  await CredentialsServices.findById({ _id: req.params.id });
    res.status(200).json(CredentialsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
    try {
      const NewCredentials = await CredentialsServices.create(req.body);
      res.status(200).send(NewCredentials);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
      const NewCredentials = await CredentialsService.updateById(req.params.id, req.body);
      res.status(200).send(NewCredentials);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
      await CredentialsService.deleteById(req.params.id);
      res.status(200).json({ message: 'Credential deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;