const jwt = require('jsonwebtoken');
const config = require('../config'); // Asegúrate de tener un archivo de configuración para la clave secreta

// Middleware para verificar el token de autenticación
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    
    if (!token) return res.sendStatus(401); // Si no hay token, devuelve 401

    jwt.verify(token, config.secret, (err, user) => {
        if (err) return res.sendStatus(403); // Si el token no es válido, devuelve 403
        req.user = user; // Guarda la información del usuario en la solicitud
        next(); // Pasa al siguiente middleware o ruta
    });
}

module.exports = authenticateToken;