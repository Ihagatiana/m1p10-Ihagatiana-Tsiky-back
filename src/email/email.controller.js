const express = require("express");
const router = express.Router();
const mailService = require("./email.services");


router.post('/sendmail', async (req, res) => {
    try {
        await mailService.sendmail();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;