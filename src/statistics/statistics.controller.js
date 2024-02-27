const express = require("express");
const router = express.Router();

const statisticsService = require("./statistics.services");
router.get("/", async (req, res) => {
  try {
    const appPerDate = await statisticsService.getAppointementByDate();
    const appPerEmp = await statisticsService.getEmployeStatistical();
    // const hoursPerEmp = await statisticsService.getHoursWorkedByEmploye();
    const hoursPerEmp = []
    res.status(200).json({ appPerDate, appPerEmp, hoursPerEmp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
