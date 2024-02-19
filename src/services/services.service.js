const Services = require("./services.model");
const imagesService = require("../util/images/images.services");

const fs = require("fs");
const { json } = require("express");

const findAll = async ({ limit, offset }) => {
  try {
    const services = await Services.find()
      .populate("images")
      .skip(offset)
      .limit(limit);
    const total = await Services.count();
    return { total, data: services };
  } catch (error) {
    throw new Error("Erreur finding services : ", error.message);
  }
};

const findById = async (servicesId) => {
  try {
    const services = await Services.findById(servicesId).populate("images");
    return services;
  } catch (error) {
    throw new Error("Error finding services : ", error);
  }
};

const create = async (
  name,
  price,
  duration,
  description,
  imagesBuffers,
  file
) => {
  try {
    const existingService = await Services.findOne({ name });
    if (existingService) {
      throw new Error("Service name already exists.");
    }
    const durationParsed = JSON.parse(duration);
    const images = await imagesService.saveImageToFolderAndDatabase(
      imagesBuffers,
      file
    );
    const service = new Services({
      name,
      price,
      duration: durationParsed,
      description,
      images,
    });
    await service.save();
    return service;
  } catch (error) {
    throw error;
  }
};

const updateById = async (serviceId, imagesBuffers, otherServiceData, file) => {
  try {
    const existingService = await Services.findById(serviceId);
    if (!existingService) {
      throw new Error("Service not found");
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
    if (imagesBuffers != null) {
      const images = await imagesService.saveImageToFolderAndDatabase(
        imagesBuffers,
        file
      );
      existingService.images = images;
    }

    await existingService.save();
    return existingService;
  } catch (error) {
    throw error;
  }
};

const deleteById = async (serviceId) => {
  try {
    const deletedService = await Services.deleteOne({ _id: serviceId });

    if (deletedService.deletedCount === 0) {
      throw new Error("Service not found");
    }
    return { message: "Service deleted successfully" };
  } catch (error) {
    return error;
  }
};

module.exports = { findAll, findById, create, updateById, deleteById };
