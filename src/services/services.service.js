const Services = require('./services.model');
const multer = require('multer');
const path = require('path');

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage: storage });

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
      throw new Error('Erreur finding services : ',error);
    }
  };
  
  const create = async(serviceData) => {
    try {
      const newService = new Services(serviceData);
      const isUnique = await Services.findOne({ name: serviceData.name });
      if (isUnique) {
        throw new Error('Service with this name already exists');
      }
      const savedService = await newService.save();
      return savedService;
    } catch (error) {
      throw new Error('Error creating service:',error.message);
    }
  }

  const updateById =async (serviceId, updateData) => {
    try {
      if (updateData.road) {
        const existingService = await Services.findById(serviceId);
        existingService.road = updateData.road;
        await existingService.save();
      }
      const updatedService = await Services.findByIdAndUpdate(serviceId, { ...updateData }, { new: true });
      if (!updatedService) {
        throw new Error('Service not found');
      }
      return updatedService;
    } catch (error) {
      throw new Error('Error updating service:', error.message);
    }
  };

  const deleteById = async (serviceId) => {
    try {
      const deletedService = await servicesModel.deleteOne({ _id: serviceId });
      if (deletedService.deletedCount === 0) {
        throw new Error('Service not found');
      }
      return { message: 'Service deleted successfully'};
    } catch (error) {
      throw new Error('Error deleting service:',error.message);
    }
  };

module.exports = {findAll,findById,create,updateById,deleteById};