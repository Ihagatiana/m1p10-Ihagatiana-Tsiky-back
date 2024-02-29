
const Offres = require('./offres.model');
require('../services/services.model');
const mongoose = require('mongoose');

const findAll =  async({ limit, offset }) => {
    try {
      const offres = await Offres.find()
      .populate('services')
      .skip(offset)
      .limit(limit);
      const total = await Offres.count();
      return { total, data: offres };
    } catch (error) {
      throw new Error('Error finding offres : ',error.message);
    }
  }

  const findById = async (offersId) => {
    try {
        const idoffres = new mongoose.Types.ObjectId(offersId);
        const offres = await Offres.findById(idoffres).populate('services');
      return offres;
    } catch (error) {
      throw new Error('Error finding offres : ',error);
    }
  };

  const create = async (offresData) => {
    try {
      const newoffres = new Offres(offresData);
      const savedoffres = await newoffres.save();
      return savedoffres;
    } catch (error) {
      throw error;
    }
  }

module.exports = { findAll, findById, create };