// Importation du module mongoose
const mongoose = require('mongoose');

// Définition du schéma de modèle Mongoose pour l'entité Sauce
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true }, // Identifiant de l'utilisateur qui a créé la sauce (obligatoire)
  name: { type: String, required: true }, // Nom de la sauce (obligatoire)
  manufacturer: { type: String, required: true }, // Fabricant de la sauce (obligatoire)
  description: { type: String, required: true }, // Description de la sauce (obligatoire)
  mainPepper: { type: String, required: true }, // Principal ingrédient de la sauce (obligatoire)
  imageUrl: { type: String, required: true }, // URL de l'image de la sauce (obligatoire)
  heat: { type: Number, required: true }, // Niveau de piquant de la sauce (obligatoire)
  likes: { type: Number, required: true, default: 0 }, // Nombre de "j'aime" pour la sauce (obligatoire, valeur par défaut: 0)
  dislikes: { type: Number, required: true, default: 0 }, // Nombre de "je n'aime pas" pour la sauce (obligatoire, valeur par défaut: 0)
  usersLiked: { type: [String], required: true, default: [] }, // Tableau d'identifiants d'utilisateurs ayant aimé la sauce (obligatoire, valeur par défaut: tableau vide)
  usersDisliked: { type: [String], required: true, default: [] } // Tableau d'identifiants d'utilisateurs n'ayant pas aimé la sauce (obligatoire, valeur par défaut: tableau vide)
});

// Exportation du schéma de modèle Mongoose de l'entité Sauce
module.exports = mongoose.model('Sauce', sauceSchema);

