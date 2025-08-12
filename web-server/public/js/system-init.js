/**
 * SLEP IQUIQUE - Inicializador del Sistema
 * Asegura que el sistema tenga datos básicos para funcionar
 */

// Función para crear usuario administrador si no existe
function ensureAdminUser() {
    try {
        const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
        const hasAdmin = users.some(u => u.status === 'admin' || u.username === 'admin');
        
        if (!hasAdmin) {
            console.log('🔧 Creando usuario administrador...');
            
            const adminUser = {
                username: 'admin',
                password: 'admin123',
                email: 'admin@slep-iquique.cl',
                nombre: 'Administrador',
                apellidoPaterno: 'Sistema',
                apellidoMaterno: 'SLEP',
                establecimiento: 'SLEP Iquique - Oficina Central',
                cargo: 'Administrador del Sistema',
                status: 'admin',
                registrationDate: new Date().toISOString(),
                createdBy: 'system',
                isSystemUser: true
            };
            
            users.push(adminUser);
            localStorage.setItem('appUsers', JSON.stringify(users));
            console.log('✅ Usuario administrador creado');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error creando administrador:', error);
        return false;
    }
}

// Función para crear usuarios de ejemplo si no existen
function createSampleUsersIfNeeded() {
    try {
        const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
        const nonAdminUsers = users.filter(u => u.status !== 'admin');
        
        if (nonAdminUsers.length === 0) {
            console.log('🧪 Creando usuarios de ejemplo...');
            
            const sampleUsers = [
                {
                    username: 'pedro.gonzalez',
                    password: 'temp123',
                    email: 'pedro.gonzalez@slep-iquique.cl',
                    nombre: 'Pedro',
                    apellidoPaterno: 'González',
                    apellidoMaterno: 'Morales',
                    fechaNacimiento: '1985-05-20',
                    establecimiento: 'Liceo A-1 Arturo Prat Chacón',
                    cargo: 'Profesor de Matemáticas',
                    status: 'pendiente',
                    registrationDate: new Date(Date.now() - 86400000).toISOString(), // Ayer
                    createdBy: 'system',
                    isSampleUser: true
                },
                {
                    username: 'ana.silva',
                    password: 'temp456',
                    email: 'ana.silva@slep-iquique.cl',
                    nombre: 'Ana',
                    apellidoPaterno: 'Silva',
                    apellidoMaterno: 'Rojas',
                    fechaNacimiento: '1990-08-15',
                    establecimiento: 'Escuela Básica Gabriela Mistral',
                    cargo: 'Directora',
                    status: 'aprobada',
                    registrationDate: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
                    approvedAt: new Date(Date.now() - 86400000).toISOString(),
                    approvedBy: 'admin',
                    createdBy: 'system',
                    isSampleUser: true
                },
                {
                    username: 'luis.martinez',
                    password: 'temp789',
                    email: 'luis.martinez@slep-iquique.cl',
                    nombre: 'Luis',
                    apellidoPaterno: 'Martínez',
                    apellidoMaterno: 'López',
                    fechaNacimiento: '1982-12-03',
                    establecimiento: 'Colegio Técnico Industrial',
                    cargo: 'Inspector General',
                    status: 'rechazada',
                    registrationDate: new Date(Date.now() - 259200000).toISOString(), // Hace 3 días
                    rejectedAt: new Date(Date.now() - 172800000).toISOString(),
                    rejectedBy: 'admin',
                    rejectionReason: 'Documentación incompleta - favor reenviar',
                    createdBy: 'system',
                    isSampleUser: true
                },
                {
                    username: 'maria.lopez',
                    password: 'temp321',
                    email: 'maria.lopez@slep-iquique.cl',
                    nombre: 'María',
                    apellidoPaterno: 'López',
                    apellidoMaterno: 'Fernández',
                    fechaNacimiento: '1988-03-12',
                    establecimiento: 'Jardín Infantil Los Peques',
                    cargo: 'Educadora de Párvulos',
                    status: 'pendiente',
                    registrationDate: new Date(Date.now() - 43200000).toISOString(), // Hace 12 horas
                    createdBy: 'system',
                    isSampleUser: true
                }
            ];
            
            // Agregar usuarios de ejemplo
            users.push(...sampleUsers);
            localStorage.setItem('appUsers', JSON.stringify(users));
            
            console.log(`✅ ${sampleUsers.length} usuarios de ejemplo creados`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('❌ Error creando usuarios de ejemplo:', error);
        return false;
    }
}

// Función para verificar integridad del sistema
function checkSystemIntegrity() {
    try {
        // Verificar localStorage
        const storageTest = 'slep_test_' + Date.now();
        localStorage.setItem(storageTest, 'test');
        localStorage.removeItem(storageTest);
        
        // Verificar usuarios
        const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
        const hasAdmin = users.some(u => u.status === 'admin');
        
        const integrity = {
            localStorage: true,
            adminExists: hasAdmin,
            totalUsers: users.length,
            pendingUsers: users.filter(u => u.status === 'pendiente').length,
            approvedUsers: users.filter(u => u.status === 'aprobada').length,
            rejectedUsers: users.filter(u => u.status === 'rechazada').length
        };
        
        console.log('🔍 Integridad del sistema:', integrity);
        return integrity;
        
    } catch (error) {
        console.error('❌ Error verificando integridad:', error);
        return { localStorage: false, error: error.message };
    }
}

// Función principal de inicialización
function initializeSystem() {
    try {
        console.log('🚀 Inicializando sistema SLEP Iquique...');
        
        // 1. Verificar integridad
        const integrity = checkSystemIntegrity();
        
        if (!integrity.localStorage) {
            console.error('❌ localStorage no disponible');
            return false;
        }
        
        // 2. Asegurar usuario administrador
        ensureAdminUser();
        
        // 3. Crear usuarios de ejemplo si es necesario
        const samplesCreated = createSampleUsersIfNeeded();
        
        // 4. Verificar integridad final
        const finalIntegrity = checkSystemIntegrity();
        
        console.log('✅ Sistema inicializado correctamente');
        console.log('📊 Estado final:', finalIntegrity);
        
        // 5. Mostrar estadísticas si están disponibles
        if (typeof showUserStats === 'function') {
            setTimeout(showUserStats, 500);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error inicializando sistema:', error);
        return false;
    }
}

// Función para resetear sistema (solo para debugging)
function resetSystemData() {
    if (confirm('⚠️ ¿Resetear TODOS los datos del sistema?\n\nEsto eliminará todos los usuarios y empezará desde cero.\n\n¿Continuar?')) {
        try {
            localStorage.removeItem('appUsers');
            localStorage.removeItem('users');
            localStorage.removeItem('currentUser');
            
            console.log('🗑️ Datos del sistema eliminados');
            
            // Reinicializar
            initializeSystem();
            
            alert('✅ Sistema reseteado y reinicializado con datos de ejemplo');
            
            // Recargar página si es posible
            if (typeof location !== 'undefined') {
                location.reload();
            }
            
        } catch (error) {
            console.error('❌ Error reseteando sistema:', error);
            alert('❌ Error reseteando sistema: ' + error.message);
        }
    }
}

// Función para mostrar ayuda del sistema
function showSystemHelp() {
    console.log(`
🏥 SISTEMA SLEP IQUIQUE - AYUDA

🔧 Funciones disponibles:
• initializeSystem() - Inicializar/reparar sistema
• checkSystemIntegrity() - Verificar estado del sistema
• resetSystemData() - Resetear todos los datos
• ensureAdminUser() - Crear usuario admin si no existe
• createSampleUsersIfNeeded() - Crear usuarios de ejemplo

🔑 Credenciales por defecto:
• Admin: admin / admin123
• Usuario demo: pedro.gonzalez / temp123

📊 Para ver estadísticas:
• showUserStats() (si está disponible)
• getUserStats() (si está disponible)

🆘 En caso de problemas:
• Ejecuta: resetSystemData()
• O manualmente: localStorage.clear() y luego initializeSystem()
    `);
}

// Auto-inicialización cuando se carga el script
if (typeof window !== 'undefined') {
    // Hacer funciones disponibles globalmente
    window.initializeSystem = initializeSystem;
    window.checkSystemIntegrity = checkSystemIntegrity;
    window.resetSystemData = resetSystemData;
    window.ensureAdminUser = ensureAdminUser;
    window.createSampleUsersIfNeeded = createSampleUsersIfNeeded;
    window.showSystemHelp = showSystemHelp;
    
    // Inicializar automáticamente cuando se carga la página
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            initializeSystem();
        }, 100);
    });
    
    // También inicializar inmediatamente si el DOM ya está listo
    if (document.readyState === 'loading') {
        // DOM aún cargando, el event listener de arriba se encargará
    } else {
        // DOM ya cargado, inicializar inmediatamente
        setTimeout(initializeSystem, 100);
    }
    
    console.log('📋 Sistema de inicialización SLEP cargado');
    console.log('💡 Escribe showSystemHelp() para ver comandos disponibles');
}

// Exportar para Node.js si está disponible
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeSystem,
        checkSystemIntegrity,
        ensureAdminUser,
        createSampleUsersIfNeeded,
        resetSystemData,
        showSystemHelp
    };
}
