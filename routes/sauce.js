// Importation du module express
const express = require('express');

// Création d'un routeur Express
const router = express.Router();

// Importation des middlewares
const auth = require('../middleware/auth'); // Middleware d'authentification
const multer = require('../middleware/multer-config'); // Middleware de gestion des fichiers uploadés

// Importation des contrôleurs de logique métier pour les sauces
const sauceCtrl = require('../controllers/sauce');

// Définition des routes de l'API pour les sauces
router.get('/', auth, sauceCtrl.getAllSauces); // Récupération de toutes les sauces
router.post('/', auth, multer, sauceCtrl.createSauce); // Création d'une nouvelle sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce); // Ajout d'un like ou dislike à une sauce existante
router.get('/:id', auth, sauceCtrl.getOneSauce); // Récupération d'une sauce par son identifiant
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Modification d'une sauce existante
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Suppression d'une sauce existante

// Exportation du routeur de l'API pour les sauces
module.exports = router;