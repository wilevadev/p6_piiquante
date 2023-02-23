// importer le modèle Sauce
const Sauce = require('../models/Sauce');

// importer le module fs pour la manipulation des fichiers
const fs = require('fs');

// définir la fonction de création d'une sauce
exports.createSauce = (req, res, next) => {

  // extraire l'objet sauce du corps de la requête
  const sauceObject = JSON.parse(req.body.sauce);

  // supprimer l'identifiant et l'identifiant de l'utilisateur de l'objet sauce
  delete sauceObject._id;
  delete sauceObject._userId;

  // créer une nouvelle sauce en utilisant l'objet sauce, l'ID de l'utilisateur et l'URL de l'image téléchargée
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  // enregistrer la nouvelle sauce dans la base de données
  sauce.save()
  .then(() => { 
    res.status(201).json({message: 'Objet enregistré !'})
  })
  .catch(error => { 
    res.status(400).json({ error })
  })
};
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ // Recherche d'une sauce par son id
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce); // Retourne la sauce trouvée avec le statut 200
      }
    ).catch(
      (error) => {
        res.status(404).json({ // Si la sauce n'est pas trouvée, retourne un message d'erreur avec le statut 404
          error: error
        });
      }
    );
  };
  
  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? { // Vérification s'il y a un nouveau fichier image dans la requête
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId; // Suppression de l'identifiant de l'utilisateur dans l'objet sauce
    Sauce.findOne({_id: req.params.id}) // Recherche de la sauce à modifier
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) { // Vérification si l'utilisateur est autorisé à modifier la sauce
                res.status(401).json({ message : 'Not authorized'}); // Si l'utilisateur n'est pas autorisé, retourne un message d'erreur avec le statut 401
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id}) // Mise à jour de la sauce
                .then(() => res.status(200).json({message : 'Objet modifié!'})) // Retourne un message de succès avec le statut 200
                .catch(error => res.status(401).json({ error })); // Si la mise à jour échoue, retourne un message d'erreur avec le statut 401
            }
        })
        .catch((error) => {
            res.status(400).json({ error }); // Si la recherche de la sauce échoue, retourne un message d'erreur avec le statut 400
        });
  };
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id}) // Cherche la sauce correspondante à l'id dans la base de données
        .then(sauce => {
            if (sauce.userId != req.auth.userId) { // Vérifie que l'utilisateur qui essaie de supprimer la sauce est le propriétaire de la sauce
                res.status(401).json({message: 'Not authorized'}); // Renvoie une erreur 401 si l'utilisateur n'est pas autorisé
            } else {
                const filename = sauce.imageUrl.split('/images/')[1]; // Récupère le nom du fichier de l'image de la sauce
                fs.unlink(`images/${filename}`, () => { // Supprime le fichier de l'image de la sauce dans le dossier 'images'
                    Sauce.deleteOne({_id: req.params.id}) // Supprime la sauce correspondante à l'id de la base de données
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})}) // Renvoie un message de confirmation de suppression si la suppression est réussie
                        .catch(error => res.status(401).json({ error })); // Renvoie une erreur 401 si la suppression échoue
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error }); // Renvoie une erreur 500 si une erreur de serveur survient lors de la recherche de la sauce à supprimer
        });
  };
  
  exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
      (sauces) => {
        res.status(200).json(sauces); // Récupère toutes les sauces de la base de données et les renvoie en tant que réponse en cas de réussite
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error // Renvoie une erreur 400 si une erreur survient lors de la récupération des sauces
        });
      }
    );
  };
  
  exports.likeSauce = (req, res, next) => { // Exporte une fonction qui gère les requêtes pour liker une sauce
    const userId = req.body.userId; // Récupère l'ID de l'utilisateur depuis le corps de la requête
    const like = req.body.like; // Récupère la valeur de like depuis le corps de la requête
    Sauce.findOne({_id: req.params.id}) // Recherche la sauce correspondant à l'ID dans la base de données
        .then(sauce => { // Si la sauce est trouvée
            const alreadyLiked = sauce.usersLiked.includes(userId); // Vérifie si l'utilisateur a déjà liké la sauce
            const alreadyDisliked = sauce.usersDisliked.includes(userId); // Vérifie si l'utilisateur a déjà disliké la sauce
            let newLikes = sauce.likes; // Initialise la variable de likes à la valeur actuelle de likes de la sauce
            let newDislikes = sauce.dislikes; // Initialise la variable de dislikes à la valeur actuelle de dislikes de la sauce
  
            if (like == 1 && !alreadyLiked) { // Si l'utilisateur veut liker la sauce et n'a pas déjà liké
                newLikes++; // Incrémente la valeur de likes
                sauce.usersLiked.push(userId); // Ajoute l'ID de l'utilisateur dans le tableau des utilisateurs qui ont liké la sauce
            } else if (like == -1 && !alreadyDisliked) { // Si l'utilisateur veut disliker la sauce et n'a pas déjà disliké
                newDislikes++; // Incrémente la valeur de dislikes
                sauce.usersDisliked.push(userId); // Ajoute l'ID de l'utilisateur dans le tableau des utilisateurs qui ont disliké la sauce
            } else if (like == 0) { // Si l'utilisateur veut annuler son like ou dislike
                if (alreadyLiked) { // Si l'utilisateur avait déjà liké
                    newLikes--; // Décrémente la valeur de likes
                    sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1); // Retire l'ID de l'utilisateur du tableau des utilisateurs qui ont liké
                } else if (alreadyDisliked) { // Si l'utilisateur avait déjà disliké
                    newDislikes--; // Décrémente la valeur de dislikes
                    sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1); // Retire l'ID de l'utilisateur du tableau des utilisateurs qui ont disliké
                }
            }
  
            Sauce.updateOne({ _id: req.params.id }, { likes: newLikes, dislikes: newDislikes, usersLiked: sauce.usersLiked, usersDisliked: sauce.usersDisliked, _id: req.params.id }) // Met à jour les informations de la sauce dans la base de données
                .then(() => res.status(200).json({message : 'Like updated!'})) // Si la mise à jour réussit, renvoie un message de succès
                .catch(error => res.status(401).json({ error })); // Si la mise à jour échoue, renvoie une erreur
        })
        .catch((error) => {
            res.status(400).json({ error }); // Si la recherche de la sauce échoue, renvoie une erreur
        });
  };