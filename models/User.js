// Importation du module mongoose
const mongoose = require('mongoose');

// Importation du module mongoose-unique-validator pour la validation de l'email unique
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma de modèle Mongoose pour l'entité User
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Adresse e-mail de l'utilisateur (obligatoire, unique)
  password: { type: String, required: true } // Mot de passe de l'utilisateur (obligatoire)
});

// Utilisation du plugin mongoose-unique-validator pour la validation de l'email unique
userSchema.plugin(uniqueValidator);

// Exportation du schéma de modèle Mongoose de l'entité User
module.exports = mongoose.model('User', userSchema);