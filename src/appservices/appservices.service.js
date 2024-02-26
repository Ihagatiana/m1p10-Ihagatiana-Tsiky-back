const AppServices = require('./appservices.model');
const appointmentServices = require('../appointments/appointments.service');
const mongoose = require('mongoose');
const serviceServices = require('../services/services.service');
const time = require('../util/Time');

const Appointments = require('../appointments/appointments.model');
const Services = require('../services/services.model');
const Employes = require('../employes/employes.model');
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

        appServiceDataList  = appServiceDataList.sort((a, b) => a.order - b.order);

        if (Array.isArray(appServiceDataList) && appServiceDataList.length > 0) {
          for (let i = 0; i < appServiceDataList.length; i++) {
            const appServiceData = appServiceDataList[i];  
            
            const appointments= new mongoose.Types.ObjectId(app);
            const services = new mongoose.Types.ObjectId(appServiceData.services);
            const serviceduration = await serviceServices.findById(appServiceData.services);
            const employes = new mongoose.Types.ObjectId(appServiceData.employes);
            const val = await getTime(appointmentData,appServiceData,appServiceDataList,serviceduration.duration);
            const starttime =  val.starttime;
            const endtime = val.endtime;
            const order = appServiceData.order
            console.log("employes==>",employes);
            console.log("appointmentData.date==>",appointmentData.date);
            console.log("starttime==>",starttime);
            console.log("endtime==>",endtime);
            
            await isEmployeeAvailable (employes,appointmentData.date, starttime, endtime);
            appServiceDatafinal.push({appointments,services,employes,starttime,endtime,order});
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

    const getTime = async(appointmentData,appServiceData,appServiceDataList,serviceduration) =>{
      if(appServiceData.order==1){
        return {
          "starttime":appointmentData.starttime,
          "endtime":time.addTime(appointmentData.starttime,serviceduration)
        }
      }else if(appServiceData.order>1){
        durationBefore = await getDurationBefore(appServiceData,appServiceDataList);
        let timesstart = time.addTime(appointmentData.starttime,durationBefore);
        return {
          "starttime": timesstart,
          "endtime":time.addTime(timesstart,serviceduration)
        }
      }
    }

    const getDurationBefore= async(appServiceData2,appServiceDataList) =>{
      let initial = { hours: 0, minutes: 0 }; 
      let val;
      if (Array.isArray(appServiceDataList) && appServiceDataList.length > 0) {
        for (let i = 0; i < appServiceDataList.length; i++) {
            const appServiceData = appServiceDataList[i];  
            if(appServiceData.order<appServiceData2.order){
              let appserv = await Services.findById(appServiceData.services);
              val = time.addTime(initial,appserv.duration);
            } 
        }
      }
      return val;
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
      const emp = new mongoose.Types.ObjectId(employeeId);
      try {
        const appService = await AppServices.findOne({
          employes: emp,
          $or: [
            {
              starttime: { $gte: startTime, $lt: endTime },
            },
            {
              endtime: { $gt: startTime, $lte: endTime },
            },
            {
              $and: [
                { starttime: { $lte: startTime } },
                { endtime: { $gte: endTime } },
              ]
            }
          ]
        });
        if (!appService) {
          return true; 
        }
        const appointmentId = appService.appointments;
        const appointment = await Appointments.findOne({
          _id: new mongoose.Types.ObjectId(appointmentId),
          date: date 
        });
        const employe = await Employes.findById(emp);
        if (appointment) {
          const message_error = "L'employé "+employe.name+" n'est pas disponible à l'heure du rendez-vous le "+date+" entre "+startTime.hours+"h"+startTime.minutes+"min à "+endTime.hours +"h"+endTime.minutes+"min";
          throw new Error(message_error);
        }
        return true;
      } catch (error) {
        throw error;
      }
    };


  module.exports = {findAll,findById,create,updateById,deleteById};