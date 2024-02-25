const AppServices = require('./appservices.model');
const appointmentServices = require('../appointments/appointments.service');
const mongoose = require('mongoose');
const serviceServices = require('../services/services.service');
const time = require('../util/Time');

require('../appointments/appointments.model');
require('../services/services.model');
require('../employes/employes.model');
require('../clients/clients.model');


    const findAll =  async({ limit, offset }) => {
        try {
        const appservices = await AppServices.find()
        .populate({
          path: 'appointments',
          populate: {
            path: 'clients',
            model: 'clients'
          }
        })
        .populate('services employes')
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
        .populate({
          path: 'appointments',
          populate: {
            path: 'clients',
            model: 'clients'
          }
        })
        .populate('services employes');
        return appservices;
        } catch (error) {
        throw new Error('Error finding Appointment Services : ',error);
        }
    };

    const create = async (appointmentData, appServiceDataList) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const app = await appointmentServices.create(appointmentData, { session });
        const appServiceDatafinal = [];
        let durationOrder = { hours: 0, minutes: 0 };
        if (Array.isArray(appServiceDataList) && appServiceDataList.length > 0) {
          for (let i = 0; i < appServiceDataList.length; i++) {
            const appServiceData = appServiceDataList[i];  
            
            const appointments= new mongoose.Types.ObjectId(app);
            const services = new mongoose.Types.ObjectId(appServiceData.services);
            const serviceduration = await serviceServices.findById(appServiceData.services);
            durationOrder = time.addTime(durationOrder,serviceduration.duration);
            const employes = new mongoose.Types.ObjectId(appServiceData.employes);
            const val = await getTime(appointmentData, appServiceDataList,appServiceData,serviceduration.duration,durationOrder);
            const starttime =  val.starttime;
            const endtime = val.endtime;
            await isEmployeeAvailable (employes,appointmentData.date, starttime, endtime);
            appServiceDatafinal.push({appointments,services,employes,starttime,endtime});
          }
          await AppServices.insertMany(appServiceDatafinal, { session });
        }
    
        console.log(appServiceDatafinal);
        await session.commitTransaction();
        session.endSession();
    
        return appServiceDatafinal;
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    };

    const getTime = async(appointmentData, appServiceDataList,appServiceData,serviceduration,durationOrder) =>{
      if(appServiceData.order==1){
        return {
          "starttime":appointmentData.starttime,
          "endtime":time.addTime(appointmentData.starttime,serviceduration)
        }
      }else if(appServiceData.order>1){
        return {
          "starttime":time.addTime(appointmentData.starttime,time.subtractTime(durationOrder,serviceduration)),
          "endtime":time.addTime(appointmentData.starttime,durationOrder)
        }
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
  
    const deleteById = async (appointmentId) => {
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

    const isEmployeeAvailable = async (employeeId,date, startTime, endTime) => {
      try {
        const existingAppointment = await AppServices.findOne({
          employes: new mongoose.Types.ObjectId(employeeId),
          $or: [
            {
              starttime: { $gte: startTime, $lt: endTime },
              date: date
            },
            {
              endtime: { $gt: startTime, $lte: endTime },
              date: date
            },
            {
              $and: [
                { starttime: { $lte: startTime } },
                { endtime: { $gte: endTime } },
                { date: date }
              ]
            }
          ]
        });
        console.log(existingAppointment);
        if (existingAppointment) {
          throw new Error(`L'employé avec l'ID ${employeeId} n'est pas disponible à l'heure du rendez-vous le ${date}.`);
        }
        return true;
      } catch (error) {
        throw error;
      }
    };
    


  module.exports = {findAll,findById,create,updateById,deleteById};