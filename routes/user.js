// Importation du module express
const express = require('express');

// Création d'un routeur Express
const router = express.Router();

// Importation du contrôleur de logique métier pour les utilisateurs
const userCtrl = require('../controllers/user');

// Définition des routes de l'API pour l'authentification des utilisateurs
router.post('/signup', userCtrl.signup); // Route pour la création d'un nouvel utilisateur
router.post('/login', userCtrl.login); // Route pour la connexion d'un utilisateur existant

// Exportation du routeur de l'API pour l'authentification des utilisateurs
module.exports = router;