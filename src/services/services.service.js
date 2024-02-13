/*
const Services = require('./services.model');

  const findAll =  async() => {
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
      throw new Error('Erreur finding services : ' + error);
    }
  };
  
  const create = async ({name, price, duration, description}) => {
    try {
      const isUnique = await Services.findOne({ name });
      if (isUnique) {
        throw { code: 409, message: 'Service with this name already exists' };
      }
      const newService = new Services({name, price, duration, description});
      const savedService = await newService.save();
      return savedService;
    } catch (error) {
      throw error;
    }
  };

  const updateById = async (serviceId, updateData) => {
    try {
      const updatedService = await Services.findByIdAndUpdate(serviceId, updateData, { new: true });
      if (!updatedService) {
        return null;
      }
      return updatedService;
    } catch (error) {
      throw new Error('Error updating service: ' + error.message);
    }
  };

  const deleteById = async (serviceId) => {
    try {
      const deletedService = await Services.deleteById(serviceId);
      if (deletedService) {
        res.status(200).json({ message: 'Service deleted successfully' });
      } else {
        res.status(404).json({ message: 'Service not found' });
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


module.exports = {findAll,findOne,create,updateById,deleteById};
*/