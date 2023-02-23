// Importation du module multer
const multer = require('multer');

// Création d'un objet qui contient les types MIME acceptés et les extensions correspondantes
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration du stockage des fichiers avec Multer
const storage = multer.diskStorage({
  // Définition du dossier de destination des fichiers téléchargés
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // Définition du nom de fichier pour chaque fichier téléchargé
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // Remplacement des espaces dans le nom de fichier par des tirets bas
    const extension = MIME_TYPES[file.mimetype]; // Récupération de l'extension correspondant au type MIME du fichier
    callback(null, name + Date.now() + '.' + extension); // Appel de callback avec le nouveau nom de fichier
  }
});

// Exportation du middleware multer configuré pour traiter les fichiers téléchargés
module.exports = multer({storage: storage}).single('image');