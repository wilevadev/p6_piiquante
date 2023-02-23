// importer le module 'http' de Node.js
const http = require('http');
// importer le module 'app' à partir d'un fichier local 'app.js'
const app = require('./app');

// fonction utilitaire pour normaliser le numéro de port
const normalizePort = val => {
  // essayer de convertir la valeur en un nombre entier
  const port = parseInt(val, 10);

  // si la conversion échoue, retourner la valeur d'origine
  if (isNaN(port)) {
    return val;
  }
  // si le numéro de port est valide, le retourner
  if (port >= 0) {
    return port;
  }
  // sinon, retourner false
  return false;
};
// déterminer le numéro de port sur lequel écouter les requêtes
const port = normalizePort(process.env.PORT || '3000');
// configurer l'application pour utiliser ce port
app.set('port', port);

// fonction pour gérer les erreurs liées à la mise en place du serveur
const errorHandler = error => {
  // si l'erreur n'est pas liée à la méthode 'listen' de l'objet 'server'
  if (error.syscall !== 'listen') {
    // lancer une nouvelle erreur
    throw error;
  }
  // obtenir l'adresse IP et le numéro de port du serveur
  const address = server.address();
  // déterminer comment le serveur est accessible (par IP ou par nom de domaine)
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  // traiter l'erreur en fonction de son code
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// créer un serveur HTTP en utilisant l'application 'app'
const server = http.createServer(app);
// ajouter un gestionnaire d'erreurs pour le serveur
server.on('error', errorHandler);
// ajouter un gestionnaire pour le moment où le serveur commence à écouter les requêtes
server.on('listening', () => {
  // obtenir l'adresse IP et le numéro de port du serveur
  const address = server.address();
  // déterminer comment le serveur est accessible (par IP ou par nom de domaine)
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  // afficher un message pour indiquer que le serveur est en cours d'écoute
  console.log('Listening on ' + bind);
});

// démarrer le serveur et commencer à écouter les requêtes sur le port spécifié
server.listen(port);