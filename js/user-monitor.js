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

// Inicialización automática cuando se carga el script
if (typeof window !== 'undefined') {
    // Mostrar estadísticas automáticamente en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setTimeout(showUserStats, 1000);
    }
    
    // Hacer funciones disponibles globalmente
    window.getUserStats = getUserStats;
    window.showUserStats = showUserStats;
    window.canAcceptMoreUsers = canAcceptMoreUsers;
    window.cleanupUsers = cleanupUsers;
    window.exportUsers = exportUsers;
}

// Exportar para Node.js si está disponible
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getUserStats,
        showUserStats,
        canAcceptMoreUsers,
        cleanupUsers,
        exportUsers
    };
}
