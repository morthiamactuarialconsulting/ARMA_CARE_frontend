export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080/api', // À modifier selon l'URL de production
  tokenExpirationTime: 15 * 60 * 1000, // 15 minutes en millisecondes
  refreshTokenExpirationTime: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
};
