/**
 * SLEP IQUIQUE - Monitor de Usuarios
 * Sistema para monitorear cantidad y estado de usuarios registrados
 */

// Función para obtener estadísticas de usuarios
function getUserStats() {
    try {
        const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
        const activeUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        const stats = {
            totalRegistered: users.length,
            pendingApproval: users.filter(u => u.status === 'pendiente').length,
            approved: users.filter(u => u.status === 'aprobado').length,
            rejected: users.filter(u => u.status === 'rechazado').length,
            activeInSystem: activeUsers.length,
            storageUsed: getStorageUsage(),
            maxCapacity: getMaxCapacity()
        };
        
        return stats;
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        return null;
    }
}

// Función para calcular uso de localStorage
function getStorageUsage() {
    try {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length + key.length;
            }
        }
        
        // Convertir a KB
        return Math.round(totalSize / 1024 * 100) / 100;
    } catch (error) {
        return 0;
    }
}

// Función para obtener capacidad máxima estimada
function getMaxCapacity() {
    // Estimación conservadora: 5MB = 5120 KB
    return 5120;
}

// Función para verificar si el sistema puede aceptar más usuarios
function canAcceptMoreUsers() {
    const stats = getUserStats();
    if (!stats) return false;
    
    const usagePercentage = (stats.storageUsed / stats.maxCapacity) * 100;
    
    return {
        canAccept: usagePercentage < 80, // Máximo 80% de uso
        usagePercentage: Math.round(usagePercentage * 100) / 100,
        remainingKB: Math.round((stats.maxCapacity - stats.storageUsed) * 100) / 100,
        estimatedUsersLeft: Math.floor((stats.maxCapacity - stats.storageUsed) / 5) // ~5KB por usuario
    };
}

// Función para mostrar estadísticas en consola
function showUserStats() {
    console.log('👥 ESTADÍSTICAS DE USUARIOS SLEP IQUIQUE');
    console.log('=' .repeat(50));
    
    const stats = getUserStats();
    const capacity = canAcceptMoreUsers();
    
    if (stats && capacity) {
        console.log(`📊 Total registrados: ${stats.totalRegistered}`);
        console.log(`⏳ Pendientes aprobación: ${stats.pendingApproval}`);
        console.log(`✅ Aprobados: ${stats.approved}`);
        console.log(`❌ Rechazados: ${stats.rejected}`);
        console.log(`🟢 Activos en sistema: ${stats.activeInSystem}`);
        console.log('─'.repeat(30));
        console.log(`💾 Almacenamiento usado: ${stats.storageUsed} KB`);
        console.log(`📈 Porcentaje de uso: ${capacity.usagePercentage}%`);
        console.log(`🆓 Espacio restante: ${capacity.remainingKB} KB`);
        console.log(`👤 Usuarios estimados restantes: ${capacity.estimatedUsersLeft}`);
        console.log(`🚦 Estado: ${capacity.canAccept ? '🟢 ACEPTANDO USUARIOS' : '🔴 LÍMITE ALCANZADO'}`);
    } else {
        console.log('❌ Error obteniendo estadísticas');
    }
    
    console.log('=' .repeat(50));
}

// Función para limpiar usuarios duplicados o corruptos
function cleanupUsers() {
    try {
        console.log('🧹 Iniciando limpieza de usuarios...');
        
        const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
        const seenUsernames = new Set();
        const seenEmails = new Set();
        const cleanUsers = [];
        
        for (let user of users) {
            // Verificar que el usuario tenga los campos mínimos requeridos
            if (!user.username || !user.email || !user.nombre) {
                console.log('🗑️ Removiendo usuario incompleto:', user);
                continue;
            }
            
            // Verificar duplicados por username
            if (seenUsernames.has(user.username)) {
                console.log('🗑️ Removiendo usuario duplicado (username):', user.username);
                continue;
            }
            
            // Verificar duplicados por email
            if (seenEmails.has(user.email)) {
                console.log('🗑️ Removiendo usuario duplicado (email):', user.email);
                continue;
            }
            
            // Agregar a conjuntos de verificación
            seenUsernames.add(user.username);
            seenEmails.add(user.email);
            cleanUsers.push(user);
        }
        
        // Guardar usuarios limpios
        localStorage.setItem('appUsers', JSON.stringify(cleanUsers));
        
        console.log(`✅ Limpieza completada: ${users.length} → ${cleanUsers.length} usuarios`);
        return {
            original: users.length,
            cleaned: cleanUsers.length,
            removed: users.length - cleanUsers.length
        };
        
    } catch (error) {
        console.error('❌ Error en limpieza:', error);
        return null;
    }
}

// Función para exportar usuarios (para backup)
function exportUsers() {
    try {
        const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
        const activeUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        const exportData = {
            exportDate: new Date().toISOString(),
            registeredUsers: users,
            activeUsers: activeUsers,
            stats: getUserStats()
        };
        
        // Crear blob para descarga
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        // Crear enlace de descarga
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `slep-usuarios-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        
        // Limpiar URL
        URL.revokeObjectURL(url);
        
        console.log('📥 Backup de usuarios exportado exitosamente');
        return true;
        
    } catch (error) {
        console.error('❌ Error exportando usuarios:', error);
        return false;
    }
}

// Función para obtener usuario actual y evitar errores
function getCurrentUser() {
    try {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser || currentUser === 'null' || currentUser === 'undefined') {
            return {};
        }
        return JSON.parse(currentUser);
    } catch (error) {
        console.error('❌ Error obteniendo usuario actual:', error);
        return {};
    }
}

// Función para cambiar pestañas (compatible con sistemas de tabs)
function switchTab(tabName, buttonElement) {
    try {
        console.log(`🔄 Cambiando a pestaña: ${tabName}`);
        
        // Remover active de todos los botones
        document.querySelectorAll('.tab-btn, .main-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Remover active de todos los contenidos
        document.querySelectorAll('.tab-content, .main-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Activar botón clickeado
        if (buttonElement) {
            buttonElement.classList.add('active');
        }
        
        // Activar contenido correspondiente
        const targetContent = document.querySelector(`[data-tab="${tabName}"], [data-maintab="${tabName}"]`);
        if (targetContent) {
            targetContent.classList.add('active');
            console.log(`✅ Pestaña activada: ${tabName}`);
        } else {
            console.warn(`⚠️ No se encontró contenido para: ${tabName}`);
        }
        
    } catch (error) {
        console.error('❌ Error cambiando pestaña:', error);
    }
}

// Función de debugging para sistema de pestañas
function debugTabs() {
    try {
        const buttons = document.querySelectorAll('.tab-btn, .main-tab-btn, .form-tab-btn');
        const contents = document.querySelectorAll('.tab-content, .main-tab-content, .form-tab-content');
        
        console.log('🔍 DEBUGGING SISTEMA DE PESTAÑAS');
        console.log('─'.repeat(40));
        console.log(`📋 Botones encontrados: ${buttons.length}`);
        console.log(`📄 Contenidos encontrados: ${contents.length}`);
        
        // Mostrar detalles de botones
        buttons.forEach((btn, index) => {
            const tabTarget = btn.dataset.tab || btn.dataset.maintab || btn.dataset.formtab || 'sin-target';
            const isActive = btn.classList.contains('active');
            console.log(`  ${index + 1}. ${tabTarget} ${isActive ? '✅' : '⭕'}`);
        });
        
        console.log('─'.repeat(40));
        
    } catch (error) {
        console.error('❌ Error en debugging de pestañas:', error);
    }
}

// Función para verificar integridad del sistema
function systemHealthCheck() {
    try {
        console.log('🏥 VERIFICACIÓN DE SALUD DEL SISTEMA');
        console.log('═'.repeat(45));
        
        // Verificar localStorage
        const localStorageWorking = (() => {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        })();
        
        console.log(`💾 localStorage: ${localStorageWorking ? '✅ OK' : '❌ FALLO'}`);
        
        // Verificar datos de usuarios
        const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
        const activeUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUser = getCurrentUser();
        
        console.log(`👥 Usuarios registrados: ${users.length}`);
        console.log(`🟢 Usuarios activos: ${activeUsers.length}`);
        console.log(`👤 Usuario actual: ${currentUser.username || 'ninguno'}`);
        
        // Verificar capacidad
        const capacity = canAcceptMoreUsers();
        if (capacity) {
            console.log(`📊 Capacidad: ${capacity.usagePercentage}% usado`);
            console.log(`🚦 Estado: ${capacity.canAccept ? '🟢 DISPONIBLE' : '🔴 LLENO'}`);
        }
        
        // Verificar elementos DOM críticos
        const criticalElements = [
            'registerForm',
            'loginForm', 
            'uploadForm'
        ];
        
        console.log('🔍 Elementos DOM críticos:');
        criticalElements.forEach(id => {
            const element = document.getElementById(id);
            console.log(`  ${id}: ${element ? '✅' : '❌'}`);
        });
        
        console.log('═'.repeat(45));
        return {
            localStorage: localStorageWorking,
            usersCount: users.length,
            activeUsersCount: activeUsers.length,
            currentUser: currentUser.username || null,
            capacity: capacity
        };
        
    } catch (error) {
        console.error('❌ Error en verificación de salud:', error);
        return null;
    }
}

// Inicialización automática cuando se carga el script
if (typeof window !== 'undefined') {
    // Mostrar estadísticas automáticamente en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setTimeout(() => {
            showUserStats();
            systemHealthCheck();
        }, 1000);
    }
    
    // Hacer funciones disponibles globalmente
    window.getUserStats = getUserStats;
    window.showUserStats = showUserStats;
    window.canAcceptMoreUsers = canAcceptMoreUsers;
    window.cleanupUsers = cleanupUsers;
    window.exportUsers = exportUsers;
    window.getCurrentUser = getCurrentUser;
    window.switchTab = switchTab;
    window.debugTabs = debugTabs;
    window.systemHealthCheck = systemHealthCheck;
    
    // Ejecutar debugging de pestañas cuando la página esté lista
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(debugTabs, 500);
        });
    } else {
        setTimeout(debugTabs, 100);
    }
    
    console.log('✅ Sistema de monitoreo y pestañas listo');
}

// Exportar para Node.js si está disponible
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getUserStats,
        showUserStats,
        canAcceptMoreUsers,
        cleanupUsers,
        exportUsers,
        getCurrentUser,
        switchTab,
        debugTabs,
        systemHealthCheck
    };
}
