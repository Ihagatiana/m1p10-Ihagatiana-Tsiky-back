const Managers = require('./managers.model');
const mongoose = require('mongoose');
require('../credentials/credentials.model');
const imagesService = require('../util/images/images.services');
const credentialsService = require('../credentials/credentials.service');

  const findAll =  async({ limit, offset }) => {
    try {
      const managers = await Managers.find()
      .populate('credential photo')
      .skip(offset)
      .limit(limit);
      const total = await Managers.count();
      return { total, data: managers };
    } catch (error) {
      throw new Error('Error finding managers : ',error.message);
    }
  }

  const findById = async (managersId) => {
    try {
      const managers = await Managers.findById(managersId).populate('credential photo');
      return managers;
    } catch (error) {
      throw new Error('Error finding managers : ',error);
    }
  };

  const create = async (name, firstname, imagesBuffers, file, credentialsData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      credentialsData.password =  bcrypt.hashSync(credentialsData.password, 10);
      const credential = await credentialsService.create(credentialsData, { session });
      const photo = await imagesService.saveImageToFolderAndDatabase(imagesBuffers, file);
      const newmanagers = new Managers({
        name: name,
        firstname: firstname,
        photo: photo,
        credential: credential._id
      });
      await newmanagers.save({ session });
      await session.commitTransaction();
      session.endSession();
      return newmanagers;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };

  const updateById = async (managersId, newmanagers) => {
    try {
      const updatedmanagers = await Managers.findByIdAndUpdate(managersId, newmanagers,{ new: true });
      return updatedmanagers;
    } catch (error) {
      throw error;
    }
  };

  const deleteById = async (managersId) => {
    try {
      const deletedManagers = await Managers.deleteOne({ _id: managersId });

      if (deletedManagers.deletedCount === 0) {
        throw new Error('Manager not found');
      }
      return { message: 'Manager deleted successfully' };
    } catch (error) {
      throw error;
    }
  };

  module.exports = {findAll,findById,create,updateById,deleteById};