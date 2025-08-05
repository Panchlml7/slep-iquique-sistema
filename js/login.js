// Sistema de autenticación con admin y usuarios pendientes

// Usuario administrador autorizado
const adminUser = {
    username: 'admin',
    email: 'admin@slepiquique.cl',
    password: 'admin123',
    status: 'admin'
};

// Inicializar sistema con usuario admin
function initializeUsers() {
    const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
    
    // Verificar si el admin ya existe
    const adminExists = users.find(u => u.username === 'admin' || u.email === 'admin@slepiquique.cl');
    if (!adminExists) {
        users.push(adminUser);
        localStorage.setItem('appUsers', JSON.stringify(users));
        console.log('✅ Usuario admin creado.');
    }
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
        
        // Permitir login para admin y usuarios aprobados
        if (user.status === 'admin' || user.status === 'aprobada') {
            const userSession = {
                username: user.username,
                email: user.email,
                status: user.status,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userSession));
            
            return {
                success: true,
                user: userSession,
                message: `✅ Bienvenido ${user.username}!`
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

// Función para verificar si es admin
function isAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.status === 'admin';
}

// Función para requerir permisos de admin
function requireAdmin() {
    if (!isAdmin()) {
        alert('⚠️ Acceso denegado\n\nEsta sección requiere permisos de administrador.');
        window.location.href = 'index.html';
        return false;
    }
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
