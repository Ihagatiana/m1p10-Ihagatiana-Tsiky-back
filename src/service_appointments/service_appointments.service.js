const ServiceAppointment = require('./appointment.model');

    const findAll =  async() => {
        try {
        const servApp = await ServiceAppointment.find()
        return { total, data: servApp };
        } catch (error) {   
        throw new Error('Erreur finding ServiceAppointment : ',error.message);
        }
    }

    const findById = async (servAppId) => {
        try {
        const servApp = await ServiceAppointment.findById(servAppId)
        return servApp;
        } catch (error) {
        throw new Error('Error finding ServiceAppointment : ',error);
        }
    };

    const create = async (servAppData) => {
        try {
          const newServApp = new ServiceAppointment(servAppData);
          const savedservApp= await newServApp.save();
          return savedservApp ;
        } catch (error) {
          throw error;
        }
      }

    const updateById = async (appointmentId, updatedData)=> {
        try {
        const existingServApp = await ServiceAppointment.findById(appointmentId);
        Object.keys(updatedData).forEach(key => {
            if (updatedData[key] !== undefined) {
            existingServApp[key] = updatedData[key];
            }
        });
        const updatedServApp = await existingServApp.save();
        return updatedServApp;
        } catch (error) {
        throw error;
        }
    }
  
    const deleteById = async () => {
        try {
        const deletedServApp = await ServiceAppointment.deleteOne({ _id: appointmentId });
        if (deletedServApp.deletedCount === 0) {
            throw new Error('ServiceAppointment not found');
        }
        return { message: 'ServiceAppointment deleted successfully' };
        } catch (error) {
        return error;
        }
    };

  module.exports = {findAll,findById,create,updateById,deleteById};