// Sistema de autenticación con admin y usuarios pendientes

// Usuarios administradores autorizados
const adminUsers = [
    {
        username: 'admin',
        email: 'admin@slepiquique.cl',
        password: 'admin123',
        status: 'admin',
        nombre: 'Administrador',
        apellidoPaterno: 'Sistema',
        apellidoMaterno: 'SLEP',
        nombreCompleto: 'Administrador Sistema SLEP',
        role: 'admin'
    },
    {
        username: 'francisco.ramos',
        email: 'francisco.ramos@slepiquique.cl',
        password: '13Jul1993',
        status: 'super_admin',
        nombre: 'Francisco',
        apellidoPaterno: 'Ramos',
        apellidoMaterno: '',
        nombreCompleto: 'Francisco Ramos',
        cargo: 'Administración',
        establecimiento: 'SLEP Iquique',
        role: 'super_admin', // ÚNICO RESPONSABLE DE PERFILES AUTORIZADOS
        permissions: {
            canPromoteToAdmin: true, // Solo Francisco puede promover a admin
            canManageAuthorizedProfiles: true, // Solo Francisco gestiona perfiles autorizados
            canChangeUserRoles: true, // Solo Francisco cambia roles
            fullSystemAccess: true
        }
    }
];

// Inicializar sistema con usuarios admin
function initializeUsers() {
    const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
    
    // Agregar ambos usuarios admin si no existen
    adminUsers.forEach(adminUser => {
        const adminExists = users.find(u => u.username === adminUser.username || u.email === adminUser.email);
        if (!adminExists) {
            users.push(adminUser);
            console.log(`✅ Usuario admin creado: ${adminUser.username}`);
        }
    });
    
    localStorage.setItem('appUsers', JSON.stringify(users));
}

// Obtener usuarios del localStorage
function getUsers() {
    const users = localStorage.getItem('appUsers');
    return users ? JSON.parse(users) : [];
}

// Guardar usuarios en localStorage
function saveUsers(users) {
    localStorage.setItem('appUsers', JSON.stringify(users));
}

// Verificar si hay usuario logueado
function isUserLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Obtener usuario actual
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Función para hacer login - Admin y usuarios aprobados
function login(username, password) {
    const users = getUsers();
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    
    if (user) {
        // Verificar estado de aprobación
        if (user.status === 'pendiente') {
            return {
                success: false,
                message: '⏳ Tu cuenta está pendiente de aprobación'
            };
        }
        
        if (user.status === 'rechazada') {
            return {
                success: false,
                message: '❌ Tu cuenta fue rechazada. Contacta al administrador'
            };
        }
        
        // Permitir login para admin, super_admin y usuarios aprobados
        if (user.status === 'admin' || user.status === 'super_admin' || user.status === 'aprobada') {
            const userSession = {
                username: user.username,
                email: user.email,
                status: user.status,
                role: user.role || user.status,
                permissions: user.permissions || {},
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userSession));
            
            let welcomeMessage = `✅ Bienvenido ${user.username}!`;
            if (user.status === 'super_admin') {
                welcomeMessage += ' (Responsable de Perfiles Autorizados)';
            } else if (user.status === 'admin') {
                welcomeMessage += ' (Administrador)';
            }
            
            return {
                success: true,
                user: userSession,
                message: welcomeMessage
            };
        }
    }
    
    return {
        success: false,
        message: '❌ Usuario o contraseña incorrectos'
    };
}

// Función para registro de usuarios pendientes de aprobación
function register(nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, username, email, password, establecimiento, cargo) {
    const users = getUsers();
    
    // Verificar si el email ya existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return {
            success: false,
            message: '⚠️ Email ya registrado\n\nEste email ya está en uso. Si tienes problemas, contacta al administrador.'
        };
    }
    
    // Verificar si el username ya existe
    const existingUsername = users.find(u => u.username === username);
    if (existingUsername) {
        return {
            success: false,
            message: '⚠️ Nombre de usuario no disponible\n\nEste nombre de usuario ya está en uso. Prueba con otro.'
        };
    }
    
    // Crear nuevo usuario pendiente
    const newUser = {
        nombre: nombre.trim(),
        apellidoPaterno: apellidoPaterno.trim(),
        apellidoMaterno: apellidoMaterno.trim(),
        nombreCompleto: `${nombre.trim()} ${apellidoPaterno.trim()} ${apellidoMaterno.trim()}`,
        fechaNacimiento,
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        establecimiento,
        cargo,
        status: 'pendiente',
        fechaRegistro: new Date().toISOString(),
        fechaUltimaActividad: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return {
        success: true,
        message: '✅ Registro exitoso\n\nTu cuenta ha sido creada y está pendiente de aprobación.\nRecibirás acceso cuando el administrador la apruebe.'
    };
}

// Función para hacer logout
function logout() {
    localStorage.removeItem('currentUser');
    // Cerrar también la sesión de seguridad del proyecto
    if (window.projectSecurity) {
        window.projectSecurity.logout();
    }
    window.location.href = 'login.html';
}

// Función para verificar y mostrar info del usuario
function checkUserSession() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        updateUserInfo(currentUser);
    }
}

// Actualizar información del usuario en la interfaz
function updateUserInfo(user) {
    const userInfoElement = document.getElementById('userInfo');
    const welcomeElement = document.getElementById('welcomeMessage');
    
    if (userInfoElement) {
        userInfoElement.textContent = user.username;
    }
    
    if (welcomeElement) {
        let welcomeText = `Bienvenido, ${user.username}`;
        if (user.status === 'admin') {
            welcomeText += ' (Administrador)';
        }
        welcomeElement.textContent = welcomeText;
    }
}

// Configurar logout button
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Función para redireccionar si no está logueado
function requireLogin() {
    if (!isUserLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Función para verificar si es Francisco (Super Admin)
function isSuperAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.status === 'super_admin' && currentUser.email === 'francisco.ramos@slepiquique.cl';
}

// Función para verificar si puede gestionar perfiles autorizados
function canManageAuthorizedProfiles() {
    return isSuperAdmin(); // Solo Francisco puede gestionar perfiles autorizados
}

// Función para verificar si puede promover usuarios a admin
function canPromoteToAdmin() {
    return isSuperAdmin(); // Solo Francisco puede promover a administradores
}

// Función para requerir permisos de admin
function requireAdmin() {
    const currentUser = getCurrentUser();
    if (!currentUser || (currentUser.status !== 'admin' && currentUser.status !== 'super_admin')) {
        alert('⚠️ Acceso denegado\n\nEsta sección requiere permisos de administrador.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// 🆕 SISTEMA MEJORADO DE PERMISOS Y ROLES

// Verificar si el usuario actual es admin normal
function isAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && (currentUser.status === 'admin' || currentUser.status === 'super_admin');
}

// Verificar si el usuario actual es admin normal (NO super admin)
function isNormalAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.status === 'admin';
}

// 🛡️ SISTEMA DE PERMISOS POR PÁGINA
function canAccessPage(pageName) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    const permissions = {
        // Páginas públicas (cualquier usuario logueado)
        'index.html': ['admin', 'super_admin', 'aprobada'],
        'asistencia.html': ['admin', 'super_admin', 'aprobada'],
        'establecimiento.html': ['admin', 'super_admin', 'aprobada'],
        'documentos.html': ['admin', 'super_admin', 'aprobada'],
        
        // Páginas de administración normal (admin y super_admin)
        'admin-usuarios.html': ['admin', 'super_admin'],
        'registro.html': ['admin', 'super_admin'],
        'registrar.html': ['admin', 'super_admin'],
        
        // Páginas exclusivas de super administración (solo Francisco)
        'perfiles-autorizados.html': ['super_admin'],
        'admin-test.html': ['super_admin']
    };
    
    const allowedRoles = permissions[pageName];
    return allowedRoles ? allowedRoles.includes(currentUser.status) : false;
}

// Verificar acceso y redirigir si es necesario
function checkPageAccess(pageName) {
    if (!isUserLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (!canAccessPage(pageName)) {
        const currentUser = getCurrentUser();
        let message = '';
        
        if (pageName === 'perfiles-autorizados.html') {
            message = '🚫 Acceso Exclusivo de Super Administración\n\nSolo Francisco Ramos (Super Admin) puede acceder a la gestión de Perfiles Autorizados.';
        } else if (['admin-usuarios.html', 'registro.html', 'registrar.html'].includes(pageName)) {
            message = '🚫 Acceso de Administración Requerido\n\nNecesitas permisos de administrador para acceder a esta página.';
        } else {
            message = '🚫 Acceso Denegado\n\nNo tienes permisos para acceder a esta página.';
        }
        
        alert(message);
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Función para mostrar mensaje de rol en la interfaz
function getUserRoleDisplay() {
    const currentUser = getCurrentUser();
    if (!currentUser) return '';
    
    switch(currentUser.status) {
        case 'super_admin':
            return '👑 Super Administrador';
        case 'admin':
            return '⚙️ Administrador';
        case 'aprobada':
            return '✅ Usuario Autorizado';
        default:
            return '👤 Usuario';
    }
}

// 🔧 FUNCIONES DE GESTIÓN DE USUARIOS

// Promover usuario a administrador (solo Francisco)
function promoteToAdmin(userEmail) {
    if (!canPromoteToAdmin()) {
        alert('🚫 Acceso Denegado\n\nSolo Francisco Ramos puede promover usuarios a administradores.');
        return false;
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === userEmail);
    
    if (userIndex === -1) {
        alert('❌ Usuario no encontrado');
        return false;
    }
    
    if (users[userIndex].status === 'admin' || users[userIndex].status === 'super_admin') {
        alert('⚠️ El usuario ya es administrador');
        return false;
    }
    
    // Promover a admin
    users[userIndex].status = 'admin';
    users[userIndex].role = 'admin';
    users[userIndex].permissions = {
        canPromoteToAdmin: false,
        canManageAuthorizedProfiles: false,
        canChangeUserRoles: false,
        fullSystemAccess: false
    };
    
    saveUsers(users);
    alert(`✅ Usuario promovido\n\n${users[userIndex].username} ahora es administrador.`);
    return true;
}

// Quitar privilegios de administrador (solo Francisco)
function removeAdminPrivileges(userEmail) {
    if (!canPromoteToAdmin()) {
        alert('🚫 Acceso Denegado\n\nSolo Francisco Ramos puede modificar roles de administrador.');
        return false;
    }
    
    // Verificar que no sea Francisco intentando quitarse sus propios privilegios
    if (userEmail === 'francisco.ramos@slepiquique.cl') {
        alert('🚫 Operación no permitida\n\nNo puedes quitar tus propios privilegios de Super Administrador.');
        return false;
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === userEmail);
    
    if (userIndex === -1) {
        alert('❌ Usuario no encontrado');
        return false;
    }
    
    if (users[userIndex].status !== 'admin') {
        alert('⚠️ El usuario no es administrador');
        return false;
    }
    
    // Quitar privilegios de admin
    users[userIndex].status = 'aprobada';
    users[userIndex].role = 'user';
    users[userIndex].permissions = {};
    
    saveUsers(users);
    alert(`✅ Privilegios removidos\n\n${users[userIndex].username} ya no es administrador.`);
    return true;
}

// Aprobar usuario pendiente (solo administradores)
function approveUser(userEmail) {
    if (!isAdmin()) {
        alert('🚫 Acceso Denegado\n\nNecesitas permisos de administrador para aprobar usuarios.');
        return false;
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === userEmail);
    
    if (userIndex === -1) {
        alert('❌ Usuario no encontrado');
        return false;
    }
    
    if (users[userIndex].status !== 'pendiente') {
        alert('⚠️ El usuario no está pendiente de aprobación');
        return false;
    }
    
    // Aprobar usuario
    users[userIndex].status = 'aprobada';
    users[userIndex].fechaAprobacion = new Date().toISOString();
    
    saveUsers(users);
    alert(`✅ Usuario aprobado\n\n${users[userIndex].username} ahora puede acceder al sistema.`);
    return true;
}

// Rechazar usuario pendiente (solo administradores)
function rejectUser(userEmail) {
    if (!isAdmin()) {
        alert('🚫 Acceso Denegado\n\nNecesitas permisos de administrador para rechazar usuarios.');
        return false;
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === userEmail);
    
    if (userIndex === -1) {
        alert('❌ Usuario no encontrado');
        return false;
    }
    
    if (users[userIndex].status !== 'pendiente') {
        alert('⚠️ El usuario no está pendiente de aprobación');
        return false;
    }
    
    // Rechazar usuario
    users[userIndex].status = 'rechazada';
    users[userIndex].fechaRechazo = new Date().toISOString();
    
    saveUsers(users);
    alert(`❌ Usuario rechazado\n\n${users[userIndex].username} no podrá acceder al sistema.`);
    return true;
}

// Función para mostrar/ocultar contraseña
function togglePasswordVisibility(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleId);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        `;
    } else {
        passwordInput.type = 'password';
        toggleIcon.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;
    }
}

// Función simple para mostrar/ocultar contraseña (compatible con login.html)
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const container = input.parentElement;
    const toggle = container.querySelector('.password-toggle');
    const eyeOpen = toggle.querySelector('.eye-open');
    const eyeClosed = toggle.querySelector('.eye-closed');
    
    if (input.type === 'password') {
        input.type = 'text';
        if (eyeOpen) eyeOpen.style.display = 'none';
        if (eyeClosed) eyeClosed.style.display = 'block';
        toggle.setAttribute('aria-label', 'Ocultar contraseña');
    } else {
        input.type = 'password';
        if (eyeOpen) eyeOpen.style.display = 'block';
        if (eyeClosed) eyeClosed.style.display = 'none';
        toggle.setAttribute('aria-label', 'Mostrar contraseña');
    }
}

// Inicialización del sistema al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar usuarios (crear admin si no existe)
    initializeUsers();
    
    // Verificar sesión de usuario
    checkUserSession();
    
    // Configurar botón de logout
    setupLogoutButton();
    
    // Configurar login form si existe
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (!username || !password) {
                if (window.showAlert) {
                    showAlert('❌ Completa todos los campos', 'error');
                } else {
                    alert('⚠️ Campos requeridos\n\nPor favor, completa todos los campos.');
                }
                return;
            }
            
            // Botón de carga
            const loginBtn = document.getElementById('loginBtn');
            const originalText = loginBtn.textContent;
            loginBtn.textContent = '⏳ Verificando...';
            loginBtn.disabled = true;
            
            // Simular delay para mejor UX
            setTimeout(() => {
                const result = login(username, password);
                
                if (result.success) {
                    if (window.showAlert) {
                        showAlert(result.message, 'success');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    if (window.showAlert) {
                        showAlert(result.message, 'error');
                    } else {
                        alert(result.message);
                    }
                    
                    // Restaurar botón
                    loginBtn.textContent = originalText;
                    loginBtn.disabled = false;
                }
            }, 500);
        });
    }
    
    // Configurar register form si existe
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value.trim();
            const apellidoPaterno = document.getElementById('apellidoPaterno').value.trim();
            const apellidoMaterno = document.getElementById('apellidoMaterno').value.trim();
            const fechaNacimiento = document.getElementById('fechaNacimiento').value;
            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            // Validaciones básicas
            if (!nombre || !apellidoPaterno || !apellidoMaterno || !fechaNacimiento || !username || !email || !password || !confirmPassword) {
                alert('⚠️ Campos requeridos\n\nPor favor, completa todos los campos.');
                return;
            }
            
            // Validar nombres (solo letras y espacios)
            const nameRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
            if (!nameRegex.test(nombre)) {
                alert('⚠️ Nombre inválido\n\nEl nombre solo puede contener letras.');
                return;
            }
            
            if (!nameRegex.test(apellidoPaterno)) {
                alert('⚠️ Apellido paterno inválido\n\nEl apellido paterno solo puede contener letras.');
                return;
            }
            
            if (!nameRegex.test(apellidoMaterno)) {
                alert('⚠️ Apellido materno inválido\n\nEl apellido materno solo puede contener letras.');
                return;
            }
            
            // Validar fecha de nacimiento
            const birthDate = new Date(fechaNacimiento);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 18) {
                alert('⚠️ Edad insuficiente\n\nDebes ser mayor de 18 años para registrarte.');
                return;
            }
            
            if (birthDate > today) {
                alert('⚠️ Fecha inválida\n\nLa fecha de nacimiento no puede ser futura.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('⚠️ Contraseñas no coinciden\n\nVerifica que las contraseñas sean iguales.');
                return;
            }
            
            if (password.length < 6) {
                alert('⚠️ Contraseña muy corta\n\nLa contraseña debe tener al menos 6 caracteres.');
                return;
            }
            
            const result = register(nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, username, email, password, '', '');
            alert(result.message);
            
            if (result.success) {
                // Limpiar formulario
                registerForm.reset();
                // Opcional: redirigir al login
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        });
    }
    
    // Configurar toggles de contraseña
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', () => togglePasswordVisibility('password', 'passwordToggle'));
    }
    
    const regPasswordToggle = document.getElementById('regPasswordToggle');
    if (regPasswordToggle) {
        regPasswordToggle.addEventListener('click', () => togglePasswordVisibility('regPassword', 'regPasswordToggle'));
    }
    
    const regConfirmPasswordToggle = document.getElementById('regConfirmPasswordToggle');
    if (regConfirmPasswordToggle) {
        regConfirmPasswordToggle.addEventListener('click', () => togglePasswordVisibility('regConfirmPassword', 'regConfirmPasswordToggle'));
    }
});

// Función para protección automática en páginas que requieren login
function autoProtectPage() {
    const protectedPages = ['index.html', 'admin-usuarios.html', 'establecimiento.html', 'asistencia.html', 'documentos.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        if (!requireLogin()) {
            return false;
        }
    }
    
    return true;
}

// Auto-proteger páginas al cargar
document.addEventListener('DOMContentLoaded', autoProtectPage);
