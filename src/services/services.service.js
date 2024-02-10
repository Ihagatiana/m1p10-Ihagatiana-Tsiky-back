const Services = require('./services.model');

  const getAll =  async() => {
    try {
      const services = await Services.find({});
      if (services) {
        console.log('Services found:', services);
      } else {
        console.log('Services not found');
      }
      return services;
    } catch (error) {
      throw new Error('Erreur finding services : ' + error);
    }
  }

  const findOne = async (servicesId) => {
    try {
      const services = await Services.findById(servicesId);
      if (services) {
        console.log('Services found:', services);
      } else {
        console.log('Services not found');
      }
      return services;
    } catch (error) {
      console.error('Error finding services:', error);
    }
  };


  const createService = async (req, res) => {
    const { name, price, duration, description } = req.body;
  
    try {
      const newService = new Services({ name, price, duration, description });
      const savedService = await newService.save();
  
      return res.status(201).json({ success: true, service: savedService });
    } catch (error) {
      console.error('Error creating service:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };


module.exports = {getAll,findOne};