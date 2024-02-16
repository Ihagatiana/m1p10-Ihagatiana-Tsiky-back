const Employes = require('./employes.model');
require('../credentials/credentials.model');
const imagesService = require('../util/images/images.services');
const credentialsService = require('../credentials/credentials.service');

  const findAll =  async() => {
    try {
      const employes = await Employes.find().populate('credential photo');
      return employes;
    } catch (error) {
      throw new Error('Error finding employes : ',error.message);
    }
  }

  const findById = async (employesId) => {
    try {
      const employes = await Employes.findById(employesId).populate('credential photo');
      return employes;
    } catch (error) {
      throw new Error('Error finding employes : ',error);
    }
  };

  const create = async (name, firstname, startTime, endTime, imagesBuffers, file, credentialsData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const credential = await credentialsService.create(credentialsData, { session });
      const photo = await imagesService.saveImageToFolderAndDatabase(imagesBuffers, file);
      const newEmployee = new Employes({
        name: name,
        firstname: firstname,
        photo: photo,
        credential: credential._id,
        starttime: {
          hours: startTime.hours,
          minutes: startTime.minutes
        },
        endtime: {
          hours: endTime.hours,
          minutes: endTime.minutes
        }
      });
      await newEmployee.save({ session });
      await session.commitTransaction();
      session.endSession();
      return newEmployee;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };

  const updateById = async (employeeId, updatedData) => {
    try {

      const nonEmptyFields = Object.entries(updatedData).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      });
      const updatedEmployee = await Employes.findByIdAndUpdate(employeeId, nonEmptyFields, { new: true });
      return updatedEmployee;
    } catch (error) {
      throw error;
    }
  };

  const deleteById = async (employeeId) => {
    try {
      const deletedEmploye = await Employes.deleteOne({ _id: employeeId });

      if (deletedEmploye.deletedCount === 0) {
        throw new Error('Employe not found');
      }
      return { message: 'Employe deleted successfully' };
    } catch (error) {
      throw error;
    }
  };

  module.exports = {findAll,findById,create,updateById,deleteById};