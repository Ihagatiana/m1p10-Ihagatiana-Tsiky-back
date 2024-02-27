const express = require("express");
const router = express.Router();
const CredentialsServices = require('./credentials.service');
const Credentials = require('./credentials.model');
const bcrypt = require("bcrypt");

router.get("/",async (req, res) => {
    try {
      const CredentialsData = await CredentialsServices.findAll({});
      res.status(200).json(CredentialsData);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});


router.post('/login',async (req, res) => {
  const { email, password } = req.body;
  try {
 
    const session = await CredentialsServices.login(email,password);
    res.status(200).json(session);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
    try {
      const credentialsData = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        roles: req.body.roles,
        status:req.body.status,
        codeActivation: req.body.codeActivation,
        codeActivationExpiration: req.body.codeActivationExpiration,
        codeResetPassword: req.body.codeResetPassword,
        codeResetPasswordExpiration: req.body.codeResetPasswordExpiration,
      };
      const NewCredentials = await CredentialsServices.create(credentialsData);
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

router.get("/:id",async (req, res) => {
  try {
    const CredentialsData =  await CredentialsServices.findById({ _id: req.params.id });
    res.status(200).json(CredentialsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;