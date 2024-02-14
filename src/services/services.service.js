const Services = require('./services.model');
const fs = require('fs');

  const findAll =  async() => {
    try {
      const services = await Services.find({});
      return services;
    } catch (error) {
      throw new Error('Erreur finding services : ',error);
    }
  }

  const findById = async (servicesId) => {
    try {
      const services = await Services.findById(servicesId);
      return services;
    } catch (error) {
      throw new Error('Error finding services : ',error);
    }
  };
  
  const create = async (name, price, duration, description, imageBuffers,req) => {
    try {
      const existingService = await Services.findOne({ name });
      if (existingService) {
        throw new Error('Service name already exists.');
      }
      const service = new Services({ name, price, duration, description });
      if (imageBuffers && imageBuffers.length > 0) {
        imageBuffers.forEach((imageBuffer, index) => {
          const imageName = req.files[index].originalname;
          const imagePath = 'src/services/uploads/'+imageName;
          console.log('Image Name:', imageName);
          console.log('Image Path:', imagePath);
          fs.writeFileSync(imagePath, imageBuffer);
          service.road.push(imagePath);
        });
      }
      await service.save();
      return service;
    } catch (error) {
      throw error;
    }
  };
  
  
  const updateById =async (serviceId, newData) => {
    try {
      const service = await Services.findById(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }
      for (const key in newData) {
        if (Object.prototype.hasOwnProperty.call(newData, key)) {
          service[key] = newData[key];
        }
      }
      await service.save();
      return service;
    } catch (error) {
      throw new Error('Error updating service:' ,error.message);
    }
  }

  const deleteById = async (serviceId) => {
    try {
      const deletedService = await Services.deleteOne({ _id: serviceId });

      if (deletedService.deletedCount === 0) {
        throw new Error('Service not found');
      }
      return { message: 'Service deleted successfully' };
    } catch (error) {
      return { error: `Error deleting service: ${error.message}` };
    }
  };

module.exports = {findAll,findById,create,updateById,deleteById};