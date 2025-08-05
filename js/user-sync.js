// SISTEMA DE SINCRONIZACIÓN AUTOMÁTICA DE USUARIOS
// Este script sincroniza automáticamente appUsers con slep_users

function syncUsersAutomatically() {
    console.log('🔄 Iniciando sincronización automática de usuarios...');
    
    const appUsers = JSON.parse(localStorage.getItem('appUsers') || '[]');
    const slepUsers = JSON.parse(localStorage.getItem('slep_users') || '[]');
    
    console.log('📊 Estado actual:');
    console.log('  - appUsers:', appUsers.length, 'usuarios');
    console.log('  - slep_users:', slepUsers.length, 'usuarios');
    
    if (appUsers.length === 0) {
        console.log('ℹ️ No hay usuarios en appUsers para sincronizar');
        return false;
    }
    
    // Convertir appUsers al formato slep_users
    const convertedUsers = appUsers.map((user, index) => ({
        id: user.id || `user${String(index + 1).padStart(3, '0')}`,
        nombre: user.nombreCompleto || 
               `${user.nombre || ''} ${user.apellidoPaterno || ''}`.trim() || 
               user.username,
        email: user.email || '',
        rut: user.rut || '',
        rol: user.cargo || user.rol || 'Usuario',
        estado: user.status === 'approved' ? 'aprobada' : 
               user.status === 'rejected' ? 'rechazada' : 'pendiente',
        fechaRegistro: user.registrationDate ? 
                      new Date(user.registrationDate).toISOString().split('T')[0] : 
                      new Date().toISOString().split('T')[0],
        ultimoAcceso: user.lastLogin ? 
                     new Date(user.lastLogin).toISOString() : 'Nunca',
        establecimiento: user.establecimiento || '',
        username: user.username || '',
        cargo: user.cargo || '',
        // Datos adicionales para compatibilidad
        password: user.password || '',
        fechaNacimiento: user.fechaNacimiento || '',
        registrationDate: user.registrationDate || '',
        approvedAt: user.approvedAt || ''
    }));
    
    // Guardar usuarios convertidos
    localStorage.setItem('slep_users', JSON.stringify(convertedUsers));
    
    console.log('✅ Sincronización completada:');
    console.log('  -', convertedUsers.length, 'usuarios convertidos de appUsers a slep_users');
    
    // Mostrar detalles de usuarios convertidos
    convertedUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.nombre} (${user.username}) - ${user.estado}`);
    });
    
    return true;
}

// Función para ejecutar sincronización si es necesaria
function checkAndSync() {
    const appUsers = JSON.parse(localStorage.getItem('appUsers') || '[]');
    const slepUsers = JSON.parse(localStorage.getItem('slep_users') || '[]');
    
    // Si hay usuarios en appUsers pero no en slep_users, sincronizar
    if (appUsers.length > 0 && slepUsers.length === 0) {
        console.log('🔍 Detectados usuarios en appUsers sin sincronizar');
        return syncUsersAutomatically();
    }
    
    // Si hay más usuarios en appUsers que en slep_users, sincronizar
    if (appUsers.length > slepUsers.length) {
        console.log('🔍 Detectados usuarios nuevos en appUsers');
        return syncUsersAutomatically();
    }
    
    console.log('ℹ️ Los usuarios ya están sincronizados');
    return false;
}

// Exportar funciones
window.syncUsersAutomatically = syncUsersAutomatically;
window.checkAndSync = checkAndSync;

// Auto-ejecutar al cargar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        checkAndSync();
    }, 100);
});

console.log('🔄 Sistema de sincronización de usuarios cargado');
