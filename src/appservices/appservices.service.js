const AppServices = require('./appservices.model');
require('../appointments/appointments.model');
require('../services/services.model');
require('../employes/employes.model');

    const findAll =  async({ limit, offset }) => {
        try {
        const appservices = await AppServices.find()
        .populate('appointments services employes')
        .skip(offset)
        .limit(limit);
        const total = await AppServices.count();
        return { total, data: appservices };
        } catch (error) {   
        throw error;
        }
    }

    const findById = async (servAppId) => {
        try {
        const appservices = await AppServices.findById(servAppId)
        return appservices;
        } catch (error) {
        throw new Error('Error finding Appointment Services : ',error);
        }
    };

    const create = async (servAppData) => {
        try {
          const newAppServices = new AppServices(servAppData);
          const savedappServ= await newAppServices.save();
          return savedappServ ;
        } catch (error) {
          throw error;
        }
      }

    const updateById = async (appointmentId, updatedData)=> {
        try {
        const existingAppServ = await AppServices.findById(appointmentId);
        Object.keys(updatedData).forEach(key => {
            if (updatedData[key] !== undefined) {
              existingservApp[key] = updatedData[key];
            }
        });
        const updatedAppServ = await existingAppServ.save();
        return updatedAppServ;
        } catch (error) {
        throw error;
        }
    }
  
    const deleteById = async () => {
        try {
        const deletedServApp = await AppServices.deleteOne({ _id: appointmentId });
        if (deletedServApp.deletedCount === 0) {
            throw new Error('Appointment Services not found');
        }
        return { message: 'Appointment Services deleted successfully' };
        } catch (error) {
        return error;
        }
    };

  module.exports = {findAll,findById,create,updateById,deleteById};