const Services = require('./services.model');
const imagesService = require('../images/images.service');

const fs = require('fs');

  const findAll =  async() => {
    try {
      const services = await Services.find().populate('id_images');
      return services;
    } catch (error) {
      throw new Error('Erreur finding services : ',error.message);
    }
  }

  const findById = async (servicesId) => {
    try {
      const services = await Services.findById(servicesId).populate('id_images');
      return services;
    } catch (error) {
      throw new Error('Error finding services : ',error);
    }
  };
  
  const create = async (name, price, duration, description, imagesBuffers,file) => {
    try {
      const existingService = await Services.findOne({ name });
      if (existingService) {
        throw new Error('Service name already exists.');
      }
      const id_images = await imagesService.saveImageToFolderAndDatabase(imagesBuffers, file);
      const service = new Services({ name, price, duration, description,id_images});
      await service.save();
      return service;
    } catch (error) {
      throw error;
    }
  };
  
  const updateById =async (serviceId, imagesBuffers, otherServiceData, file) => {
    try {
      const existingService = await Services.findById(serviceId);
      console.log('serviceId',serviceId);
      if (!existingService) {
        throw new Error('Service not found');
      }
      if (otherServiceData.name) {
        existingService.name = otherServiceData.name;
      }
      if (otherServiceData.price) {
        existingService.price = otherServiceData.price;
      }
      if (otherServiceData.duration) {
        existingService.duration = otherServiceData.duration;
      }
      if (otherServiceData.description) {
        existingService.description = otherServiceData.description;
      }
      if (otherServiceData.description) {
        existingService.description = otherServiceData.description;
      }
      if (imagesBuffers.length >0){
        const id_images = await imagesService.saveImageToFolderAndDatabase(imagesBuffers, file);
        existingService.id_images = id_images;
      }
      await existingService.save();
      return existingService;
    } catch (error) {
      throw error;
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
      return error;
    }
  };

module.exports = {findAll,findById,create,updateById,deleteById};