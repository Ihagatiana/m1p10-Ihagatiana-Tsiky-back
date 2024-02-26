const express = require("express");
const router = express.Router();
const managersService = require("./managers.service");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const managers = await managersService.findAll({
      limit: req.query?.limit,
      offset: req.query?.offset,
    });
    res.status(200).json(managers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const managersId = req.params.id;
  try {
    const managers = await managersService.findById({ _id: managersId });
    res.status(200).json(managers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", upload.array("photos"), async (req, res) => {
  try {
    const { name, firstname,credential } = req.body;
    const imagesBuffers = req.files
      ? req.files.map((file) => file.buffer)
      : null;
    const files = req.files;
    const newService = await managersService.create(
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

router.put("/:id", upload.array('photos'), async (req, res) => {
    try {
      const managersId = req.params.id;
      const imagesBuffers = req.files ? req.files.map(file => file.buffer) : null; 
      const newmanagers = {
        name: req.body.name,
        firstname: req.body.firstname, 
        credential:req.body.credential
      };
      const file = req.files;
      const updatedmanagers =  await managersService.updateById(managersId,newmanagers);
      res.status(200).send(updatedmanagers);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating managers.');
    }
  });
  
router.delete("/:id", async (req, res) => {
  const managersId = req.params.id;
  try {
    const result = await managersService.deleteById(managersId);
    if (result.error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json({ message: "Managers deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
