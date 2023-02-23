// importer le module Express pour créer une application web
const express = require('express');
// importer le module body-parser pour faciliter la manipulation des requêtes HTTP
const bodyparser = require('body-parser');
// importer le module Mongoose pour manipuler les données dans la base de données MongoDB
const mongoose = require('mongoose');
// importer les routes de l'application pour les sauces
const sauceRoutes = require('./routes/sauce');
// importer les routes de l'application pour les utilisateurs
const userRoutes = require('./routes/user');
// importer le module path pour gérer les chemins de fichiers
const path = require('path');
// importer le module morgan pour enregistrer les journaux d'accès HTTP
const morgan = require('morgan');
// importer le module dotenv pour charger les variables d'environnement depuis un fichier .env
const dotEnv = require("dotenv");
// charger les variables d'environnement à partir du fichier .env
dotEnv.config();

// se connecter à la base de données MongoDB en utilisant les informations de connexion stockées dans la variable d'environnement MONGO_DB
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// créer une application Express
const app = express();
// ajouter un middleware pour autoriser l'accès à l'API depuis n'importe quelle origine
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
});

// ajouter le middleware body-parser pour faciliter la manipulation des requêtes HTTP
app.use(bodyparser.json());

// ajouter le middleware express.json() pour faciliter la manipulation des requêtes HTTP
app.use(express.json());

// ajouter les routes pour les sauces
app.use('/api/sauces', sauceRoutes);

// ajouter le middleware morgan pour enregistrer les journaux d'accès HTTP
app.use(morgan('dev'));

// ajouter les routes pour les utilisateurs
app.use('/api/auth', userRoutes);

// ajouter un middleware pour servir des fichiers statiques (images)
app.use('/images', express.static(path.join(__dirname, 'images')));

// exporter l'application
module.exports = app;