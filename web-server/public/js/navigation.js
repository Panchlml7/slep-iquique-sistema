/**
 * 🚀 FUNCIONES DE NAVEGACIÓN SLEP IQUIQUE
 * Archivo externo para evitar conflictos en index.html
 */

console.log('📂 Cargando navigation.js...');

// ===== FUNCIONES DE NAVEGACIÓN PRINCIPALES =====

// 📊 Ir a Asistencia
function goToAsistencia() {
    console.log('🚀 NAVEGACIÓN: goToAsistencia() ejecutada');
    window.location.href = 'asistencia.html';
}

// 👥 Mostrar Usuarios / Admin
function showUsers() {
    console.log('🚀 NAVEGACIÓN: showUsers() ejecutada');
    window.location.href = 'admin-usuarios.html';
}

// 🔐 Verificar Login y Redirigir a Documentos
function checkLoginAndRedirect() {
    console.log('🚀 NAVEGACIÓN: checkLoginAndRedirect() ejecutada');
    
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        console.log('✅ Usuario logueado encontrado, navegando a documentos...');
        window.location.href = 'documentos/documentos.html';
    } else {
        console.log('⚠️ No hay usuario logueado, navegando a login...');
        window.location.href = 'login.html';
    }
}

// 🎫 Mostrar Habilitación
function showHabilitacion() {
    console.log('🚀 NAVEGACIÓN: showHabilitacion() ejecutada');
    window.location.href = 'establecimiento.html';
}

// 🔧 Ir a Panel de Administración
function goToAdmin() {
    console.log('🚀 NAVEGACIÓN: goToAdmin() ejecutada');
    
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.status === 'admin' || user.role === 'superadmin') {
            console.log('✅ Usuario admin verificado, accediendo al panel...');
            window.location.href = 'admin-usuarios.html';
        } else {
            alert('❌ Acceso denegado: Se requieren permisos de administrador');
        }
    } else {
        alert('⚠️ Debe iniciar sesión primero');
        window.location.href = 'login.html';
    }
}

// 🔔 Toggle Panel de Notificaciones
function toggleNotificationPanel() {
    console.log('🚀 NAVEGACIÓN: toggleNotificationPanel() ejecutada');
    
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        const isVisible = panel.style.display === 'block';
        panel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            console.log('🔔 Abriendo panel de notificaciones...');
            // Cargar notificaciones si existe la función
            if (typeof loadNotifications === 'function') {
                loadNotifications();
            }
        }
    } else {
        console.log('⚠️ Panel de notificaciones no encontrado');
    }
}

// ===== FUNCIONES DE UTILIDAD =====

// Función para verificar si una función existe
function checkFunction(funcName) {
    return typeof window[funcName] === 'function';
}

// Función de debug para mostrar todas las funciones cargadas
function debugFunctions() {
    const functions = [
        'goToAsistencia',
        'showUsers', 
        'checkLoginAndRedirect',
        'showHabilitacion',
        'goToAdmin',
        'toggleNotificationPanel'
    ];
    
    console.log('🔍 VERIFICACIÓN DE FUNCIONES:');
    functions.forEach(func => {
        const status = checkFunction(func) ? '✅' : '❌';
        console.log(`${status} ${func}: ${typeof window[func]}`);
    });
}

// Auto-verificación al cargar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 navigation.js: DOM completamente cargado');
    debugFunctions();
    console.log('✅ Sistema de navegación listo');
});

console.log('📂 navigation.js cargado exitosamente');
