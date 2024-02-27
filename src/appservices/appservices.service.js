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
            let appdetail = await getTime(appointmentData,appServiceData,appServiceDataList,serviceduration.duration);
            const starttime =  appdetail.starttime;
            const endtime = appdetail.endtime;
            const order = appServiceData.order
            const employee = await Employes.findById(employes);
            const empdetail = { "starttime": employee.starttime,"endtime": employee.endtime }; 

            console.log("appdetail=>"+appdetail);
            console.log("empdetail=>"+empdetail);

            await isAppointmentWithinWorkingHours(appdetail,empdetail);
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

    const isAppointmentWithinWorkingHours = (appointment, employee) => {
      const appointmentStartTime = time.convertToNumber(appointment.starttime);
      const appointmentEndTime =  time.convertToNumber(appointment.endtime);

      const workingStartTime =  time.convertToNumber(employee.starttime);
      const workingEndTime =  time.convertToNumber(employee.endtime);
    
      // Vérifier si l'heure de début du rendez-vous est avant l'heure de début de travail
      if (time.compareTimes(appointmentStartTime, workingStartTime) === -1) {
        throw new Error(`Erreur : L'employé travaille de ${time.formatTime(workingStartTime)} à ${time.formatTime(workingEndTime)}. Le rendez-vous ne peut pas commencer avant ${time.formatTime(workingStartTime)}.`);
      }

      // Vérifier si l'heure de fin du rendez-vous est après l'heure de fin de travail
      if (time.compareTimes(appointmentEndTime, workingEndTime) === 1) {
        throw new Error( `Erreur : L'employé travaille de ${time.formatTime(workingStartTime)} à ${time.formatTime(workingEndTime)}. Le rendez-vous ne peut pas se terminer après ${time.formatTime(workingEndTime)}.`);
      }
    };

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