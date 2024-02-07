const serviceModel = require('./src/service/service.model');
require('dotenv').config();
var express = require('express');
var app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_LINK||'mongodb://localhost:27017/beautysalon', { useNewUrlParser: true, useUnifiedTopology: true });

const serviceData = require('./src/service/service.collection');

async function seedDatabase() {
    try {
      const insertedService = await serviceModel.insertMany(serviceData);
      console.log('Données de test insérées avec succès :', insertedService);
    } catch (error) {
      console.error('Erreur lors de l\'insertion des données de test :', error);
    } finally {
      mongoose.connection.close();
    }
  }
  
seedDatabase();