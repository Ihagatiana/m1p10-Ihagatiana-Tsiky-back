const Credentials = require('./credentials.model');

    const findAll =  async() => {
        try {
        const credentials = await Credentials.find()
        return credentials;
        } catch (error) {   
        throw new Error('Erreur finding credentials : ',error.message);
        }
    }

    const findById = async (credentialsId) => {
        try {
        const credentials = await Credentials.findById(credentialsId)
        return credentials;
        } catch (error) {
        throw new Error('Error finding credentials : ',error);
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
      }

    const updateById = async (credentialsId, updatedData)=> {
        try {
        const existingCredentials = await Credentials.findById(credentialsId);
        Object.keys(updatedData).forEach(key => {
            if (updatedData[key] !== undefined) {
            existingCredentials[key] = updatedData[key];
            }
        });
        const updatedCredentials = await existingCredentials.save();
        return updatedCredentials;
        } catch (error) {
        throw error;
        }
    }
  
    const deleteById = async () => {
        try {
        const deletedCredentials = await Credentials.deleteOne({ _id: credentialsId });
        if (deletedCredentials.deletedCount === 0) {
            throw new Error('Credentials not found');
        }
        return { message: 'Credentials deleted successfully' };
        } catch (error) {
        return error;
        }
    };

  module.exports = {findAll,findById,create,updateById,deleteById};