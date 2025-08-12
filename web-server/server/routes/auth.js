/**
 * 🔐 RUTAS DE AUTENTICACIÓN
 * Sistema SLEP IQUIQUE
 * Desarrollador: Francisco Ramos
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

// Ruta para el registro de nuevos usuarios
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuario ya existe' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

// Ruta para el inicio de sesión
/**
 * 🔐 RUTAS DE AUTENTICACIÓN
 * Sistema SLEP IQUIQUE
 * Desarrollador: Francisco Ramos
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Importar configuración y base de datos
const config = require('../config');
const db = require('../models/database');

// Rate limiting para intentos de login
const loginLimiter = rateLimit({
    windowMs: config.security.rateLimitWindowMs,
    max: config.security.maxLoginAttempts,
    message: {
        error: 'Demasiados intentos de login',
        message: 'Por favor, intente nuevamente en 15 minutos',
        retryAfter: Math.ceil(config.security.rateLimitWindowMs / 60000)
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting general para API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite por IP
    message: {
        error: 'Demasiadas solicitudes',
        message: 'Límite de API excedido'
    }
});

// Aplicar rate limiting a todas las rutas
router.use(apiLimiter);

/**
 * 🔑 LOGIN - Autenticar usuario
 */
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password, rut } = req.body;

        // Validar datos requeridos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email y contraseña son requeridos'
            });
        }

        console.log(`🔐 Intento de login: ${email}`);

        // Buscar usuario en la base de datos
        const user = await db.findUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales inválidas'
            });
        }

        // Verificar si el usuario está activo
        if (!user.active) {
            return res.status(403).json({
                success: false,
                error: 'Usuario desactivado. Contacte al administrador.'
            });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales inválidas'
            });
        }

        // Actualizar último login
        await db.updateUserLastLogin(user.id);

        // Generar JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
                establecimiento: user.establecimiento
            },
            config.jwt.secret,
            { 
                expiresIn: config.jwt.expiresIn,
                issuer: config.jwt.issuer,
                audience: config.jwt.audience
            }
        );

        // Respuesta exitosa
        res.json({
            success: true,
            message: `¡Bienvenido/a al Sistema SLEP IQUIQUE!`,
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                role: user.role,
                establecimiento: user.establecimiento,
                lastLogin: new Date().toISOString()
            }
        });

        console.log(`✅ Login exitoso: ${email} - ${user.role}`);

    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

/**
 * 🔄 REFRESH TOKEN - Renovar token
 */
router.post('/refresh', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Token requerido'
            });
        }

        // Verificar token existente
        const decoded = jwt.verify(token, config.jwt.secret);
        
        // Verificar que el usuario aún existe y está activo
        const user = await db.findUserById(decoded.userId);
        
        if (!user || !user.active) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no válido'
            });
        }

        // Generar nuevo token
        const newToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
                establecimiento: user.establecimiento
            },
            config.jwt.secret,
            { 
                expiresIn: config.jwt.expiresIn,
                issuer: config.jwt.issuer,
                audience: config.jwt.audience
            }
        );

        res.json({
            success: true,
            token: newToken,
            message: 'Token renovado exitosamente'
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expirado'
            });
        }
        
        console.error('❌ Error al renovar token:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

/**
 * 🚪 LOGOUT - Cerrar sesión
 */
router.post('/logout', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, config.jwt.secret);
            console.log(`👋 Logout: ${decoded.email}`);
        }

        res.json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        });

    } catch (error) {
        // Incluso si hay error en el token, permitir logout
        res.json({
            success: true,
            message: 'Sesión cerrada'
        });
    }
});

/**
 * 👤 VERIFICAR PERFIL - Obtener información del usuario actual
 */
router.get('/profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Token de acceso requerido'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, config.jwt.secret);
        
        // Obtener información actualizada del usuario
        const user = await db.findUserById(decoded.userId);
        
        if (!user || !user.active) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no válido'
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rut: user.rut,
                role: user.role,
                establecimiento: user.establecimiento,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expirado'
            });
        }
        
        console.error('❌ Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

/**
 * 🔐 CAMBIAR CONTRASEÑA
 */
router.post('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Token de acceso requerido'
            });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Contraseña actual y nueva contraseña son requeridas'
            });
        }

        if (newPassword.length < config.security.passwordMinLength) {
            return res.status(400).json({
                success: false,
                error: `La nueva contraseña debe tener al menos ${config.security.passwordMinLength} caracteres`
            });
        }

        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await db.findUserById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        // Verificar contraseña actual
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                error: 'Contraseña actual incorrecta'
            });
        }

        // Encriptar nueva contraseña
        const saltRounds = config.security.saltRounds;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Actualizar contraseña en la base de datos
        await db.updateUserPassword(user.id, hashedNewPassword);

        res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });

        console.log(`🔐 Contraseña cambiada para: ${user.email}`);

    } catch (error) {
        console.error('❌ Error al cambiar contraseña:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

/**
 * 📊 ESTADO DEL SISTEMA
 */
router.get('/system-status', async (req, res) => {
    try {
        const health = await db.healthCheck();
        
        res.json({
            success: true,
            system: 'SLEP IQUIQUE',
            version: config.developer.version,
            status: 'online',
            database: health,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al verificar estado del sistema'
        });
    }
});

module.exports = router;

module.exports = router;