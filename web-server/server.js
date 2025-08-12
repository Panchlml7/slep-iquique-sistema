/**
 * 🚀 SERVIDOR PRINCIPAL SLEP IQUIQUE
 * Sistema de Gestión Educativa
 * Desarrollador: Francisco Ramos (panchoramos39@gmail.com)
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

// Importar configuración
const config = require('./server/config/index');

// Crear aplicación Express
const app = express();
const PORT = config.server.port;

console.log('🏛️ ========================================');
console.log('🏛️ SISTEMA SLEP IQUIQUE INICIANDO...');
console.log('🏛️ ========================================');
console.log(`👨‍💻 Desarrollador: ${config.developer.name}`);
console.log(`📧 Contacto: ${config.developer.email}`);
console.log(`🔢 Versión: ${config.developer.version}`);
console.log('🏛️ ========================================');

// Crear directorios necesarios
const requiredDirs = [
    './server/data',
    './server/backups',
    './public/uploads',
    './logs',
    './temp'
];

requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Directorio creado: ${dir}`);
    }
});

// Middleware de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrcAttr: ["'self'", "'unsafe-inline'"], // Permite atributos onclick, onchange, etc.
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "ws:", "wss:"]
        },
    },
}));

// Middleware de CORS
app.use(cors({
    origin: config.security.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware de logging
app.use(morgan('combined'));

// Middleware para parsing
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para añadir headers de seguridad adicionales
app.use((req, res, next) => {
    res.header('X-Powered-By', 'SLEP IQUIQUE Sistema v2.0');
    res.header('X-Developer', 'Francisco Ramos');
    next();
});

// ===== RUTAS API =====

// Ruta de salud del sistema
app.get('/api/health', async (req, res) => {
    try {
        const db = require('./server/models/database');
        const health = await db.healthCheck();
        
        res.json({
            status: 'OK',
            system: 'SLEP IQUIQUE',
            version: config.developer.version,
            timestamp: new Date().toISOString(),
            database: health,
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Cargar rutas de la aplicación de forma segura
try {
    const authRoutes = require('./server/routes/auth');
    app.use('/api/auth', authRoutes);
    console.log('✅ Rutas de autenticación cargadas');
} catch (error) {
    console.log('⚠️ Rutas de autenticación no disponibles:', error.message);
}

try {
    const userRoutes = require('./server/routes/users');
    app.use('/api/users', userRoutes);
    console.log('✅ Rutas de usuarios cargadas');
} catch (error) {
    console.log('⚠️ Rutas de usuarios no disponibles:', error.message);
}

try {
    const adminRoutes = require('./server/routes/admin');
    app.use('/api/admin', adminRoutes);
    console.log('✅ Rutas de administración cargadas');
} catch (error) {
    console.log('⚠️ Rutas de administración no disponibles:', error.message);
}

// Ruta principal - servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas específicas del sistema
const systemRoutes = [
    '/login',
    '/admin-usuarios',
    '/perfiles-autorizados',
    '/asistencia',
    '/documentos',
    '/establecimiento'
];

systemRoutes.forEach(route => {
    app.get(route, (req, res) => {
        const filename = route.substring(1) + '.html';
        const filePath = path.join(__dirname, 'public', filename);
        
        // Verificar si el archivo existe
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.redirect('/');
        }
    });
});

// Ruta especial para documentos
app.get('/documentos/*', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'documentos', 'documentos.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.redirect('/');
    }
});

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({
            error: 'Endpoint no encontrado',
            path: req.path,
            method: req.method
        });
    } else {
        // Para rutas de frontend, redirigir al index
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error('❌ Error del servidor:', err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
});

// Función para iniciar el servidor
async function startServer() {
    try {
        // Inicializar base de datos
        const db = require('./server/models/database');
        await db.initialize();
        console.log('✅ Base de datos inicializada correctamente');

        // Obtener IP local para mostrar en el log
        const os = require('os');
        const networkInterfaces = os.networkInterfaces();
        let localIP = 'localhost';
        
        for (const interfaceName in networkInterfaces) {
            for (const interface of networkInterfaces[interfaceName]) {
                if (interface.family === 'IPv4' && !interface.internal) {
                    localIP = interface.address;
                    break;
                }
            }
        }

        // Iniciar servidor
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log('🏛️ ========================================');
            console.log(`🚀 SERVIDOR SLEP IQUIQUE EJECUTÁNDOSE`);
            console.log(`📡 URL Local: http://localhost:${PORT}`);
            console.log(`🌐 Red Local: http://${localIP}:${PORT}`);
            console.log('🏛️ ========================================');
            console.log(`� Sistema: ${config.developer.system}`);
            console.log(`👥 Autor: ${config.developer.name}`);
            console.log(`📧 Contacto: ${config.developer.email}`);
            console.log(`🔧 GitHub: https://github.com/${config.developer.github}`);
            console.log('🏛️ ========================================');
            console.log('📋 ACCESO DESDE OTROS DISPOSITIVOS:');
            console.log(`📱 Móvil/Tablet: http://${localIP}:${PORT}`);
            console.log(`� Otra PC: http://${localIP}:${PORT}`);
            console.log('🔥 Sistema listo para multi-dispositivo');
            console.log('🏛️ ========================================');
        });

        return server;

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

// Manejo de señales del sistema
process.on('SIGINT', async () => {
    console.log('\n🔄 Cerrando servidor SLEP IQUIQUE...');
    console.log('👋 ¡Hasta la vista!');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🔄 Cerrando servidor SLEP IQUIQUE...');
    process.exit(0);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Rechazo no manejado en:', promise, 'razón:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Excepción no capturada:', error);
    process.exit(1);
});

// Iniciar el servidor
if (require.main === module) {
    startServer();
}

module.exports = app;