const mongoose = require('mongoose');
require("dotenv").config();

async function connectToDatabase() {
    try {
      await mongoose.connect(process.env.DB_LINK, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).then(() => {
        console.log('Connected to the database');
      });
      
    } catch (error) {
      console.error('Error connecting to the database:', error.message);
      throw error; // Renvoie l'erreur pour la gérer dans votre fichier app.js
    }
  }
  
module.exports = { connectToDatabase };