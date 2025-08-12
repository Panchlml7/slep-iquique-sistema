/**
 * 🔧 CONFIGURACIÓN DEL SISTEMA SLEP IQUIQUE
 * Archivo de configuración centralizado para el servidor
 */

module.exports = {
    // Configuración del servidor
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || '0.0.0.0',
        environment: process.env.NODE_ENV || 'development'
    },

    // Configuración JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'slep-iquique-super-secret-key-2025-francisco-ramos',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        algorithm: 'HS256'
    },

    // Configuración de la base de datos (archivos JSON)
    database: {
        dataDirectory: './server/data',
        files: {
            users: 'users.json',
            documents: 'documents.json',
            attendance: 'attendance.json',
            logs: 'system-logs.json'
        },
        backup: {
            enabled: true,
            interval: '24h', // cada 24 horas
            directory: './server/backups'
        }
    },

    // Configuración de archivos y uploads
    upload: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['.xlsx', '.xls', '.csv', '.pdf', '.doc', '.docx'],
        destination: './public/uploads/',
        tempDirectory: './temp/'
    },

    // URLs del sistema
    urls: {
        frontend: process.env.FRONTEND_URL || 'http://localhost:3000',
        api: process.env.API_URL || 'http://localhost:3000/api',
        public: process.env.PUBLIC_URL || 'http://localhost:3000'
    },

    // Configuración de seguridad
    security: {
        saltRounds: 10, // Para bcrypt
        maxLoginAttempts: 5,
        lockoutTime: 15 * 60 * 1000, // 15 minutos
        corsOrigins: process.env.CORS_ORIGINS ? 
            process.env.CORS_ORIGINS.split(',') : 
            ['http://localhost:3000', 'http://127.0.0.1:3000']
    },

    // Configuración de logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: './logs/slep-iquique.log',
        maxSize: '10mb',
        maxFiles: 5
    },

    // Configuración específica de SLEP IQUIQUE
    slep: {
        name: 'SLEP IQUIQUE',
        fullName: 'Servicio Local de Educación Pública de Iquique',
        region: 'Tarapacá',
        establecimientos: [
            'Instituto Comercial Baldomero Wolnitzky',
            'Escuela Especial Flor del Inca',
            'Escuela Artística Violeta Parra',
            'Liceo Libertador General Bernardo O\'Higgins',
            'Liceo Politécnico José Gutiérrez de la Fuente',
            'Liceo Deportivo Elena Duvauchelle Cabezón',
            'Liceo Bicentenario Domingo Santa María',
            'Escuela Gabriela Mistral',
            'Escuela Eduardo Llanos Nava',
            'Escuela Almirante Patricio Lynch',
            'Escuela Plácido Villarroel',
            'Escuela República de Croacia',
            'Escuela Paula Jaraquemada',
            'Escuela Centenario',
            'Escuela Thilda Portillo Olivares',
            'Escuela España',
            'Liceo Luis Cruz Martínez',
            'Colegio Manuel Castro Ramos',
            'Colegio República de Italia'
        ]
    },

    // Configuración de roles y permisos
    roles: {
        super_admin: {
            name: 'Super Administrador',
            permissions: ['all']
        },
        admin: {
            name: 'Administrador',
            permissions: ['users', 'documents', 'attendance', 'reports']
        },
        user: {
            name: 'Usuario',
            permissions: ['documents', 'attendance']
        }
    },

    // Configuración de email (para futuras implementaciones)
    email: {
        enabled: false,
        service: process.env.EMAIL_SERVICE || 'gmail',
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM || 'noreply@slepiquique.cl'
    },

    // Configuración de cache
    cache: {
        enabled: true,
        ttl: 300, // 5 minutos
        maxEntries: 1000
    },

    // Información del desarrollador
    developer: {
        name: 'Francisco Ramos',
        email: 'panchoramos39@gmail.com',
        github: 'panchlml7',
        version: '2.0.0'
    }
};
