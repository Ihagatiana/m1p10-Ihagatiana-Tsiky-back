const Employes = require("./employes.model");
const mongoose = require("mongoose");
require("../credentials/credentials.model");
const imagesService = require("../util/images/images.services");
const credentialsService = require("../credentials/credentials.service");
const AppService = require("../appservices/appservices.model");

const findAppServicesByEmpId = async (query, { offset, limit }) => {
  const data = await AppService.find(query)
    .populate({
      path: "appointments",
      populate: {
        path: "clients",
        model: "clients",
      },
    })
    .populate("services")
    .populate("employes")
    .skip(offset)
    .limit(limit);

  const total = await AppService.count(query);
  return { total, data };
};
const findAll = async ({ limit, offset }) => {
  try {
    const employes = await Employes.find()
      .populate("credential photo")
      .skip(offset)
      .limit(limit);
    const total = await Employes.count();
    return { total, data: employes };
  } catch (error) {
    throw new Error("Employé introuvable: ", error.message);
  }
};

const findById = async (employesId) => {
  try {
    const employes = await Employes.findById(employesId).populate(
      "credential photo"
    );
    return employes;
  } catch (error) {
    throw new Error("Employé introuvable: ", error);
  }
};

const create = async (
  name,
  firstname,
  startTime,
  endTime,
  imagesBuffers,
  file,
  credentialsData
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const credential = await credentialsService.create(credentialsData, {
      session,
    });
    const photo = await imagesService.saveImageToFolderAndDatabase(
      imagesBuffers,
      file
    );
    const newEmployee = new Employes({
      name: name,
      firstname: firstname,
      photo: photo,
      credential: credential._id,
      starttime: {
        hours: startTime.hours,
        minutes: startTime.minutes,
      },
      endtime: {
        hours: endTime.hours,
        minutes: endTime.minutes,
      },
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

const updateById = async (employeeId, newEmployee) => {
  try {
    const updatedEmployee = await Employes.findByIdAndUpdate(
      employeeId,
      newEmployee,
      { new: true }
    );
    return updatedEmployee;
  } catch (error) {
    throw error;
  }
};

const deleteById = async (employeId) => {
  try {
    const deletedEmploye = await Employes.deleteOne({ _id: employeId });

    if (deletedEmploye.deletedCount === 0) {
      throw new Error("Employe not found");
    }
    return { message: "Employe deleted successfully" };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
  findAppServicesByEmpId,
};
