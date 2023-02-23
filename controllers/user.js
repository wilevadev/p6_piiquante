const bcrypt = require('bcrypt'); // Importation du package de cryptage de mots de passe bcrypt
const jwt = require('jsonwebtoken'); // Importation du package de génération de token JWT
const User = require('../models/User'); // Importation du modèle User

exports.signup = (req, res, next) => { // Route pour l'inscription d'un utilisateur
    bcrypt.hash(req.body.password, 10) // Cryptage du mot de passe saisi par l'utilisateur
      .then(hash => {
        const user = new User({ // Création d'un nouvel utilisateur avec l'email et le mot de passe crypté
          email: req.body.email,
          password: hash
        });
        user.save() // Sauvegarde de l'utilisateur dans la base de données
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // Retourne une réponse de succès en cas de création d'utilisateur réussie
          .catch(error => res.status(400).json({ error })); // Retourne une erreur en cas d'échec de la création d'utilisateur
      })
      .catch(error => res.status(500).json({ error })); // Retourne une erreur en cas d'échec du cryptage de mot de passe
  };

  exports.login = (req, res, next) => { // Route pour la connexion d'un utilisateur
    User.findOne({ email: req.body.email }) // Recherche de l'utilisateur dans la base de données par son email
        .then(user => {
            if (!user) { // Si l'utilisateur n'existe pas
                return res.status(401).json({ error: 'Utilisateur non trouvé !' }); // Retourne une erreur d'authentification
            }
            bcrypt.compare(req.body.password, user.password) // Comparaison du mot de passe saisi par l'utilisateur avec celui enregistré en base de données
                .then(valid => {
                    if (!valid) { // Si les mots de passe ne correspondent pas
                        return res.status(401).json({ error: 'Mot de passe incorrect !' }); // Retourne une erreur d'authentification
                    }
                    res.status(200).json({ // Si l'authentification est réussie, retourne un objet contenant l'ID de l'utilisateur et un token JWT pour l'authentification future
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET', // Clé secrète pour la signature du token JWT
                            { expiresIn: '24h' } // Durée de validité du token JWT
                        )
                    });
                })
                .catch(error => res.status(500).json({ error })); // Retourne une erreur en cas d'échec de la comparaison de mots de passe
        })
        .catch(error => res.status(500).json({ error })); // Retourne une erreur en cas d'échec de la recherche de l'utilisateur en base de données
 };