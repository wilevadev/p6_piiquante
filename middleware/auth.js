// Importation du module jsonwebtoken
const jwt = require('jsonwebtoken');
 
// Exportation du middleware d'authentification
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // Récupération du token JWT depuis l'en-tête Authorization
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Décodage du token avec la clé secrète "RANDOM_TOKEN_SECRET"
       const userId = decodedToken.userId; // Récupération de l'ID utilisateur à partir du token décodé
       req.auth = {
           userId: userId // Stockage de l'ID utilisateur dans l'objet "auth" de la requête
       };
	next(); // Passez à la suite du traitement de la requête
   } catch(error) {
       res.status(401).json({ error }); // Renvoyer une erreur 401 (non autorisé) si le token est invalide ou expiré
   }
};