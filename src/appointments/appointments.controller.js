const express = require("express");
const router = express.Router();
const AppointmentsServices = require('./appointments.service');
const Appointments = require('./appointments.model');

router.get("/",async (req, res) => {
    try {
      const AppointmentsData = await AppointmentsServices.findAll({});
      res.status(200).json(AppointmentsData);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.get("/:id",async (req, res) => {
  try {
    const AppointmentsData =  await AppointmentsServices.findById({ _id: req.params.id });
    res.status(200).json(AppointmentsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
    try {
      const AppointmentData = {
        date: req.body.date,
        client: req.body.client, 
        state: req.body.state
      };
      const NewAppointments = await AppointmentsServices.create(AppointmentData);
      res.status(200).send(NewAppointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
      const NewAppointments = await AppointmentsServices.updateById(req.params.id, req.body);
      res.status(200).send(NewAppointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
      await AppointmentsServices.deleteById(req.params.id);
      res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;