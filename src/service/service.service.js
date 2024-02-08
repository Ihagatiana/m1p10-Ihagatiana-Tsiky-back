const Service = require('./service.model');
  const getAllServices =  async() => {
    try {
      console.log('Before Service.find()');
      const services = await Service.find({});
      console.log('After Service.find():', services);
      return services;
    } catch (err) {
      throw new Error('Erreur lors de la récupération des services : ' + err.message);
    }
  }

module.exports = {getAllServices};