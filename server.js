require('dotenv').config();
const routes = require('./src/route');
var express = require('express');
var app = express();
const mongoose = require('mongoose');

db = mongoose.connect(process.env.DB_LINK||'mongodb://localhost:27017/beautysalon', { useNewUrlParser: true, useUnifiedTopology: true });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , authorization ");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use(express.json());
app.use('/api',routes);

console.log('Serveur démarré sur '+process.env.SERVER_LINK||'http://localhost:3000');
app.listen(process.env.SERVER_PORT || 3000);