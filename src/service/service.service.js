const Service = require('./service.model');
  const getAllServices =  async() => {
    try {
      const services = await Service.find({});
      return services;
    } catch (err) {
      throw new Error('Erreur lors de la récupération des services : ' + err.message);
    }
  }

module.exports = {getAllServices};