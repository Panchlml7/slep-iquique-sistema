const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

class Database {
    constructor() {
        this.dataDir = path.join(__dirname, '../data');
        this.usersFile = path.join(this.dataDir, 'users.json');
        this.documentsFile = path.join(this.dataDir, 'documents.json');
        this.attendanceFile = path.join(this.dataDir, 'attendance.json');
        
        this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            // Crear directorio de datos si no existe
            await fs.mkdir(this.dataDir, { recursive: true });
            
            console.log('🚀 Inicializando base de datos SLEP IQUIQUE...');
            
            // Inicializar archivos si no existen
            await this.initializeUsers();
            await this.initializeDocuments();
            await this.initializeAttendance();
            
            console.log('✅ Base de datos inicializada correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar base de datos:', error);
        }
    }

    async initializeUsers() {
        try {
            await fs.access(this.usersFile);
            console.log('📁 Archivo de usuarios ya existe');
        } catch {
            console.log('👥 Creando usuarios iniciales...');
            
            // Crear usuarios iniciales del sistema SLEP IQUIQUE
            const initialUsers = [
                {
                    id: 'francisco-ramos-super-admin',
                    username: 'francisco.ramos',
                    email: 'francisco.ramos@slepiquique.cl',
                    password: await bcrypt.hash('admin123', 10),
                    nombreCompleto: 'Francisco Ramos',
                    nombre: 'Francisco',
                    apellidoPaterno: 'Ramos',
                    apellidoMaterno: 'González',
                    role: 'super_admin',
                    status: 'aprobada',
                    establecimiento: 'SLEP IQUIQUE - Administración Central',
                    cargo: 'Super Administrador del Sistema',
                    rut: '12.345.678-9',
                    telefono: '+56 9 8765 4321',
                    registrationDate: new Date().toISOString(),
                    fechaAprobacion: new Date().toISOString(),
                    aprobadoPor: 'Sistema',
                    permisos: ['all']
                },
                {
                    id: 'admin-sistema-general',
                    username: 'admin',
                    email: 'admin@slepiquique.cl',
                    password: await bcrypt.hash('admin123', 10),
                    nombreCompleto: 'Administrador del Sistema',
                    nombre: 'Admin',
                    apellidoPaterno: 'Sistema',
                    apellidoMaterno: 'SLEP',
                    role: 'admin',
                    status: 'aprobada',
                    establecimiento: 'SLEP IQUIQUE',
                    cargo: 'Administrador General',
                    rut: '98.765.432-1',
                    telefono: '+56 9 1234 5678',
                    registrationDate: new Date().toISOString(),
                    fechaAprobacion: new Date().toISOString(),
                    aprobadoPor: 'Francisco Ramos',
                    permisos: ['users', 'documents', 'reports']
                },
                {
                    id: 'usuario-demo-pruebas',
                    username: 'usuario',
                    email: 'usuario@slepiquique.cl',
                    password: await bcrypt.hash('user123', 10),
                    nombreCompleto: 'Usuario de Pruebas',
                    nombre: 'Usuario',
                    apellidoPaterno: 'Demo',
                    apellidoMaterno: 'Pruebas',
                    role: 'user',
                    status: 'aprobada',
                    establecimiento: 'Escuela de Pruebas SLEP',
                    cargo: 'Usuario de Testing',
                    rut: '11.222.333-4',
                    telefono: '+56 9 9999 0000',
                    registrationDate: new Date().toISOString(),
                    fechaAprobacion: new Date().toISOString(),
                    aprobadoPor: 'Francisco Ramos',
                    permisos: ['documents', 'attendance']
                }
            ];
            
            await fs.writeFile(this.usersFile, JSON.stringify(initialUsers, null, 2));
            console.log(`✅ ${initialUsers.length} usuarios iniciales creados`);
        }
    }

    async initializeDocuments() {
        try {
            await fs.access(this.documentsFile);
            console.log('📄 Archivo de documentos ya existe');
        } catch {
            console.log('📋 Creando estructura de documentos...');
            
            const initialDocuments = [
                {
                    id: 'doc-ejemplo-' + Date.now(),
                    acta: 'ACTA-001-2025',
                    objetivo: 'Documento de ejemplo para pruebas del sistema',
                    establecimiento: 'Escuela Gabriela Mistral',
                    rbd: '111',
                    asesor1: 'Francisco Ramos',
                    asesor2: 'Admin Sistema',
                    fecha: new Date().toISOString().split('T')[0],
                    modalidad: 'Presencial',
                    capacidadBasal: 'Liderazgo Pedagógico',
                    createdAt: new Date().toISOString(),
                    createdBy: 'francisco.ramos'
                }
            ];
            
            await fs.writeFile(this.documentsFile, JSON.stringify(initialDocuments, null, 2));
            console.log('✅ Estructura de documentos creada');
        }
    }

    async initializeAttendance() {
        try {
            await fs.access(this.attendanceFile);
            console.log('📊 Archivo de asistencia ya existe');
        } catch {
            console.log('📈 Creando estructura de asistencia...');
            await fs.writeFile(this.attendanceFile, JSON.stringify([], null, 2));
            console.log('✅ Estructura de asistencia creada');
        }
    }

    // ===== MÉTODOS PARA USUARIOS =====
    
    async getUsers() {
        try {
            const data = await fs.readFile(this.usersFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer usuarios:', error);
            return [];
        }
    }

    async getUserById(id) {
        const users = await this.getUsers();
        return users.find(user => user.id === id);
    }

    async getUserByEmail(email) {
        const users = await this.getUsers();
        return users.find(user => user.email === email);
    }

    async getUserByUsername(username) {
        const users = await this.getUsers();
        return users.find(user => user.username === username);
    }

    async saveUser(user) {
        try {
            const users = await this.getUsers();
            const existingIndex = users.findIndex(u => u.id === user.id);
            
            if (existingIndex !== -1) {
                users[existingIndex] = { ...users[existingIndex], ...user };
                console.log(`👤 Usuario actualizado: ${user.username}`);
            } else {
                user.id = user.id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                users.push(user);
                console.log(`➕ Usuario creado: ${user.username}`);
            }
            
            await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2));
            return user;
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const users = await this.getUsers();
            const filteredUsers = users.filter(user => user.id !== id);
            
            if (users.length === filteredUsers.length) {
                throw new Error('Usuario no encontrado');
            }
            
            await fs.writeFile(this.usersFile, JSON.stringify(filteredUsers, null, 2));
            console.log(`🗑️ Usuario eliminado: ${id}`);
            return true;
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    }

    // ===== MÉTODOS PARA DOCUMENTOS =====
    
    async getDocuments() {
        try {
            const data = await fs.readFile(this.documentsFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer documentos:', error);
            return [];
        }
    }

    async saveDocument(document) {
        try {
            const documents = await this.getDocuments();
            document.id = document.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            document.createdAt = document.createdAt || new Date().toISOString();
            
            documents.push(document);
            await fs.writeFile(this.documentsFile, JSON.stringify(documents, null, 2));
            
            console.log(`📄 Documento guardado: ${document.acta}`);
            return document;
        } catch (error) {
            console.error('Error al guardar documento:', error);
            throw error;
        }
    }

    async getDocumentById(id) {
        const documents = await this.getDocuments();
        return documents.find(doc => doc.id === id);
    }

    // ===== MÉTODOS PARA ASISTENCIA =====
    
    async getAttendance() {
        try {
            const data = await fs.readFile(this.attendanceFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer asistencia:', error);
            return [];
        }
    }

    async saveAttendance(attendance) {
        try {
            const attendanceData = await this.getAttendance();
            attendance.id = attendance.id || `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            attendance.uploadedAt = attendance.uploadedAt || new Date().toISOString();
            
            attendanceData.push(attendance);
            await fs.writeFile(this.attendanceFile, JSON.stringify(attendanceData, null, 2));
            
            console.log(`📊 Datos de asistencia guardados: ${attendance.establecimiento || 'Sin especificar'}`);
            return attendance;
        } catch (error) {
            console.error('Error al guardar asistencia:', error);
            throw error;
        }
    }

    // ===== MÉTODOS DE UTILIDAD =====
    
    async getStats() {
        const users = await this.getUsers();
        const documents = await this.getDocuments();
        const attendance = await this.getAttendance();

        return {
            users: {
                total: users.length,
                pendientes: users.filter(u => u.status === 'pendiente').length,
                aprobados: users.filter(u => u.status === 'aprobada').length,
                rechazados: users.filter(u => u.status === 'rechazada').length,
                admins: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length
            },
            documents: {
                total: documents.length,
                thisMonth: documents.filter(d => {
                    const docDate = new Date(d.createdAt);
                    const now = new Date();
                    return docDate.getMonth() === now.getMonth() && 
                           docDate.getFullYear() === now.getFullYear();
                }).length
            },
            attendance: {
                total: attendance.length
            }
        };
    }

    // Método para verificar la salud de la base de datos
    async healthCheck() {
        try {
            const users = await this.getUsers();
            const documents = await this.getDocuments();
            const attendance = await this.getAttendance();
            
            return {
                status: 'healthy',
                users: users.length,
                documents: documents.length,
                attendance: attendance.length,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'error',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    /**
     * 🚀 INICIALIZAR SISTEMA
     * Crear archivos de datos y usuarios por defecto
     */
    async initialize() {
        try {
            console.log('🔧 Inicializando sistema de base de datos...');

            // Verificar/crear directorio de datos
            const fs_sync = require('fs');
            if (!fs_sync.existsSync(this.dataDir)) {
                fs_sync.mkdirSync(this.dataDir, { recursive: true });
                console.log('📁 Directorio de datos creado');
            }

            // Crear archivos de datos básicos si no existen
            const defaultUsers = [];
            const defaultDocuments = [];
            const defaultAttendance = [];

            if (!fs_sync.existsSync(this.usersFile)) {
                await fs.writeFile(this.usersFile, JSON.stringify(defaultUsers, null, 2));
                console.log('👥 Archivo de usuarios creado');
            }

            if (!fs_sync.existsSync(this.documentsFile)) {
                await fs.writeFile(this.documentsFile, JSON.stringify(defaultDocuments, null, 2));
                console.log('📄 Archivo de documentos creado');
            }

            if (!fs_sync.existsSync(this.attendanceFile)) {
                await fs.writeFile(this.attendanceFile, JSON.stringify(defaultAttendance, null, 2));
                console.log('📊 Archivo de asistencia creado');
            }

            console.log('🎉 Sistema inicializado correctamente');
            return true;

        } catch (error) {
            console.error('❌ Error al inicializar sistema:', error);
            throw error;
        }
    }

}

// Crear y exportar instancia única de la base de datos
const database = new Database();
module.exports = database;