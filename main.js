const userModel = require('./user/models/userModel');
require('dotenv').config();
var express = require('express');
var app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_LINK||'mongodb://localhost:27017/beautysalon', { useNewUrlParser: true, useUnifiedTopology: true });

const userData = require('./user/collections/userCollection');

async function seedDatabase() {
    try {
      await userModel.deleteMany(); 
      const insertedUsers = await userModel.insertMany(userData);
      console.log('Données de test insérées avec succès :', insertedUsers);
    } catch (error) {
      console.error('Erreur lors de l\'insertion des données de test :', error);
    } finally {
      mongoose.connection.close();
    }
  }
  
seedDatabase();