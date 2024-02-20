const Appointment = require('./appointment.model');

    const findAll =  async() => {
        try {
        const appointment = await Appointment.find()
        return appointment;
        } catch (error) {   
        throw new Error('Erreur finding appointment : ',error.message);
        }
    }

    const findById = async (appointmentId) => {
        try {
        const appointment = await Appointment.findById(appointmentId)
        return appointment;
        } catch (error) {
        throw new Error('Error finding appointment : ',error);
        }
    };

    const create = async (appointmentData) => {
        try {
          const newappointment = new Appointment(appointmentData);
          const savedappointment = await newappointment.save();
          return { total, data: savedappointment };
        } catch (error) {
          throw error;
        }
      }

    const updateById = async (appointmentId, updatedData)=> {
        try {
        const existingappointment = await Appointment.findById(appointmentId);
        Object.keys(updatedData).forEach(key => {
            if (updatedData[key] !== undefined) {
            existingappointment[key] = updatedData[key];
            }
        });
        const updatedappointment = await existingappointment.save();
        return updatedappointment;
        } catch (error) {
        throw error;
        }
    }
  
    const deleteById = async () => {
        try {
        const deletedappointment = await Appointment.deleteOne({ _id: appointmentId });
        if (deletedappointment.deletedCount === 0) {
            throw new Error('Appointment not found');
        }
        return { message: 'Appointment deleted successfully' };
        } catch (error) {
        return error;
        }
    };

  module.exports = {findAll,findById,create,updateById,deleteById};