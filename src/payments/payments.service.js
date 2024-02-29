const Payments = require("./payments.model");
require("../clients/clients.model");
const AppServices = require("../appservices/appservices.model");
require("../employes/employes.model");
require("../managers/managers.model");
const mongoose = require("mongoose");

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
    const clientsId = new mongoose.Types.ObjectId(clients);
    const appservicesId = new mongoose.Types.ObjectId(appservices);
    const paymentsData = {
      date: date,
      clients: clientsId,
      appservices: appservicesId,
    };
    const newPayments = new Payments(paymentsData);
    const savedPayments = await newPayments.save();

    await AppServices.updateOne(
      { _id: appservicesId },
      { $set: { states: 11 } }
    );

    return savedPayments;
  } catch (error) {
    throw error;
  }
};

module.exports = { findAll, findById, create, findByClientId };
