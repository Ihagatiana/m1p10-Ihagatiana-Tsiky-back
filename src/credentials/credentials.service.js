const Credentials = require("./credentials.model");

const Employes = require("../employes/employes.model");
const Clients = require("../clients/clients.model");
require("dotenv").config();
const Session = require("../sessions/sessions.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('../util/images/images.model');

const login = async (email, password) => {
  try {
    const user = await Credentials.findOne({ email });

    console.log("comparaison", password);
    console.log("et", user.password);

    if (user && bcrypt.compareSync(password, user.password)) {
      console.log("ato2");
      const token = jwt.sign({ userId: user._id },process.env.JWT, {
        expiresIn: "1h",
      });

      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1);
      let name = "";
      let photo = [];
      let profile_id = "";

      if (user.roles === "manager") {
        const managerDetails = await Managers.findOne({ credential: user._id }).populate('photo');
        name = managerDetails.name;
        profile_id = managerDetails._id;
        photo = managerDetails.photo;
      } else if (user.roles === "employe") {
        console.log(user._id);
        const employeDetails = await Employes.findOne({ credential: user._id }).populate('photo');
        name = employeDetails.name;
        profile_id = employeDetails._id;

        photo = employeDetails.photo;
      } else {
        const clientDetails = await Clients.findOne({ credential: user._id }).populate('photo');
        name = clientDetails.name;
        profile_id = clientDetails._id;

        photo = clientDetails.photo;
      }

      const session = new Session({
        status: "active",
        credential: user._id,
        token,
        date: expirationDate.toISOString(),
        name,
        photo,
        roles: user.roles,
      });
      await session.save();
      return { session, profile_id };
    } else {
      throw new Error("Email ou Mot de passe incorrect");
    }
  } catch (error) {
    throw error;
  }
};

const findAll = async () => {
  try {
    const credentials = await Credentials.find();
    return credentials;
  } catch (error) {
    throw new Error("Erreur finding credentials : ", error.message);
  }
};

const findById = async (credentialsId) => {
  try {
    const credentials = await Credentials.findById(credentialsId);
    return credentials;
  } catch (error) {
    throw new Error("Error finding credentials : ", error);
  }
};

const create = async (credentialsData) => {
  try {
    const newCredentials = new Credentials(credentialsData);
    const savedCredentials = await newCredentials.save();
    return savedCredentials;
  } catch (error) {
    throw error;
  }
};

const updateById = async (credentialsId, updatedData) => {
  try {
    const existingCredentials = await Credentials.findById(credentialsId);
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] !== undefined) {
        existingCredentials[key] = updatedData[key];
      }
    });
    const updatedCredentials = await existingCredentials.save();
    return updatedCredentials;
  } catch (error) {
    throw error;
  }
};

const deleteById = async () => {
  try {
    const deletedCredentials = await Credentials.deleteOne({
      _id: credentialsId,
    });
    if (deletedCredentials.deletedCount === 0) {
      throw new Error("Credentials not found");
    }
    return { message: "Credentials deleted successfully" };
  } catch (error) {
    return error;
  }
};

module.exports = { login, findAll, findById, create, updateById, deleteById };
