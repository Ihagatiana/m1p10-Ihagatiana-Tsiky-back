const Payments = require("./payments.model");
require("../clients/clients.model");
const AppServices = require("../appservices/appservices.model");
require("../employes/employes.model");
require("../managers/managers.model");
const mongoose = require("mongoose");
const Services = require('../services/services.model');
const Offres = require('../offres/offres.model');

const findAll = async ({ limit, offset }) => {
  try {
    const payments = await Payments.find()
      .populate({
        path: "appservices",
        populate: {
          path: "services employes",
        },
      })
      .populate("clients")
      .skip(offset)
      .limit(limit);
    const total = await Payments.count();
    return { total, data: payments };
  } catch (error) {
    throw new Error("Erreur payement non trouver : ", error.message);
  }
};

const findById = async (paymentsId) => {
  try {
    const payments = await Payments.findById(paymentsId).populate(
      "credential photo"
    );
    return payments;
  } catch (error) {
    throw new Error("Erreur payement non trouver : ", error);
  }
};

const findByClientId = async (clientId, { limit, offset }) => {
  const payments = await Payments.find({ clients: { _id: clientId } })
    .populate({
      path: "appservices",
      populate: {
        path: "services employes",
      },
    })
    .populate("clients")
    .skip(offset)
    .limit(limit);
  const total = await Payments.count({ clients: { _id: clientId } });
  return { total, data: payments };
};

const create = async (dates, clients, appservices) => {
  try {
    const date = new Date(dates);
    date.setHours(0, 0, 0, 0);
    const clientsId = new mongoose.Types.ObjectId(clients);
    const appservicesId = new mongoose.Types.ObjectId(appservices);
    const appservData = await AppServices.findById(appservicesId).populate('appointments');
    const services = await Services.findById(appservData.services);
    const date_rdv = appservData.appointments.date;

    console.log("type===>"+ appservData.appointments.date);
    let date_rdv2 = new Date(date_rdv);

    console.log("date_rdv==>"+date_rdv2);
    console.log("services==>"+ services._id);
    const offres = await Offres.findOne({ date_rdv2, services:services._id });
  
    const prix = services.price;
    if(offres){
      prix = prix - (prix * offres.percentage / 100); 
      console.log("cette service a un reduction de: "+offres.percentage+"%");
    }
    console.log("valeur prix==>"+prix);

    const paymentsData = {
      date: date,
      clients: clientsId,
      appservices: appservicesId,
      amount : prix
    };
    const newPayments = new Payments(paymentsData);
    const savedPayments = await newPayments.save();

    await AppServices.updateOne(
      { _id: appservicesId },
      { $set: { states: 11 }}
    );
    return savedPayments;
  } catch (error) {
    throw error;
  }
};

module.exports = { findAll, findById, create, findByClientId };
