const serviceService = require('./service.service');

class ServiceController {
    async getAllServices(req, res) {
      try {
        const services = await serviceService.getAllServices();
        res.json(services);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  }
  module.exports = new ServiceController();
  