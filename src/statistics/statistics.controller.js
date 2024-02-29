const express = require("express");
const router = express.Router();

const statisticsService = require("./statistics.services");
router.get("/", async (req, res) => {
  try {
    const [appPerDate, appPerEmp, hoursPerEmp, caPerMonth] = await Promise.all([
      statisticsService.getAppointementByDate(),
      statisticsService.getEmployeStatistical(),
      statisticsService.getAvgHoursPerEmp(),
      statisticsService.getCaPerMonth(),
    ]);

    res.status(200).json({ appPerDate, appPerEmp, hoursPerEmp, caPerMonth });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/benefits", async (req, res) => {
  try {
    const params = {
      salary: isNaN(+req.query?.salary) ? 0 : +req.query?.salary,
      rent: isNaN(+req.query?.rent) ? 0 : +req.query?.rent,
      purchases: isNaN(+req.query?.purchases) ? 0 : +req.query?.purchases,
      expenses: isNaN(+req.query?.expenses) ? 0 : +req.query?.expenses,
    };
    console.log(params);
    const benefitsPerMonth = await statisticsService.getBenefitsPerMonth(
      params
    );
    res.status(200).json({ benefitsPerMonth });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
