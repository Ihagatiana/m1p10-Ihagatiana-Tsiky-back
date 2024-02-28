const express = require("express");
const router = express.Router();
const clientsService = require("./clients.service");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const clients = await clientsService.findAll({
      limit: req.query?.limit,
      offset: req.query?.offset,
    });
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/appservices/:id", async (req, res) => {
  try {
    const paginationQuery = {
      limit: req.query?.limit,
      offset: req.query?.offset,
    };
    const clientId = req.params.id;

    const appServices = await clientsService.getAppServices(
      clientId ? { clients: clientId } : {},
      paginationQuery
    );
    res.status(200).json(appServices);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const clientsId = req.params.id;
  try {
    const clients = await clientsService.findById({ _id: clientsId });
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", upload.array("photos"), async (req, res) => {
  try {
    const { name, firstname, credential } = req.body;
    const imagesBuffers = req.files
      ? req.files.map((file) => file.buffer)
      : null;
    const files = req.files;
    const newService = await clientsService.create(
      name,
      firstname,
      imagesBuffers,
      files,
      credential
    );
    res.status(201).send(newService);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.put("/:id", upload.array("photos"), async (req, res) => {
  try {
    const employeId = req.params.id;
    const imagesBuffers = req.files
      ? req.files.map((file) => file.buffer)
      : null;
    const newEmployee = {
      name: req.body.name,
      firstname: req.body.firstname,
      credential: req.body.credential,
    };
    const file = req.files;
    const updatedClients = await clientsService.updateById(
      employeId,
      newEmployee
    );
    res.status(200).send(updatedClients);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating clients.");
  }
});

router.delete("/:id", async (req, res) => {
  const serviceId = req.params.id;
  try {
    const result = await clientsService.deleteById(serviceId);
    if (result.error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
