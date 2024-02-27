const Clients = require('./clients.model');
const mongoose = require('mongoose');
require('../credentials/credentials.model');
const imagesService = require('../util/images/images.services');
const credentialsService = require('../credentials/credentials.service');

  const findAll =  async({ limit, offset }) => {
    try {
      const clients = await Clients.find()
      .populate('credential photo')
      .skip(offset)
      .limit(limit);
      const total = await Clients.count();
      return { total, data: clients };
    } catch (error) {
      throw new Error('Error finding clients : ',error.message);
    }
  }

  const findById = async (clientsId) => {
    try {
      const clients = await Clients.findById(clientsId).populate('credential photo');
      return clients;
    } catch (error) {
      throw new Error('Error finding clients : ',error);
    }
  };

  const create = async (name, firstname, imagesBuffers, file, credentialsData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      credentialsData.password =  bcrypt.hashSync(credentialsData.password, 10);
      const credential = await credentialsService.create(credentialsData, { session });
      const photo = await imagesService.saveImageToFolderAndDatabase(imagesBuffers, file);
      const newclients = new Clients({
        name: name,
        firstname: firstname,
        photo: photo,
        credential: credential._id
      });
      await newclients.save({ session });
      await session.commitTransaction();
      session.endSession();
      return newclients;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };

  const updateById = async (clientsId, newclients) => {
    try {
      const updatedclients = await Clients.findByIdAndUpdate(clientsId, newclients,{ new: true });
      return updatedclients;
    } catch (error) {
      throw error;
    }
  };

  const deleteById = async (clientsId) => {
    try {
      const deletedEmploye = await Clients.deleteOne({ _id: clientsId });

      if (deletedEmploye.deletedCount === 0) {
        throw new Error('Client not found');
      }
      return { message: 'Client deleted successfully' };
    } catch (error) {
      throw error;
    }
  };

  module.exports = {findAll,findById,create,updateById,deleteById};