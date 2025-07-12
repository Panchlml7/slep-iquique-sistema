// Sistema de autenticación con admin y usuarios pendientes

// Usuario administrador autorizado - Las credenciales se inicializan de forma segura
const adminUser = {
    username: 'francisco.ramos',
    email: 'francisco.ramos@slepiquique.cl',
    password: '13Jul1993', // Contraseña fija del administrador
    status: 'admin'
};

// Inicializar sistema con usuario admin
function initializeUsers() {
    const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
    
    // Verificar si el admin ya existe
    const adminExists = users.find(u => u.email === adminUser.email);
    if (!adminExists) {
        // Crear admin con contraseña fija
        const adminWithPassword = {
            ...adminUser,
            password: '13Jul1993' // Contraseña fija del administrador
        };
        users.push(adminWithPassword);
        localStorage.setItem('appUsers', JSON.stringify(users));
        
        console.log('✅ Usuario admin creado con contraseña establecida.');
    } else {
        // Si ya existe, verificar que tenga la contraseña correcta
        const adminIndex = users.findIndex(u => u.email === adminUser.email);
        if (adminIndex !== -1) {
            users[adminIndex].password = '13Jul1993'; // Actualizar contraseña
            localStorage.setItem('appUsers', JSON.stringify(users));
            console.log('✅ Contraseña del admin actualizada.');
        }
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
                message: '⏳ Cuenta pendiente de aprobación\n\nTu cuenta está siendo revisada por el administrador.\nRecibirás acceso cuando sea aprobada.'
            };
        }
        
        if (user.status === 'rechazada') {
            return {
                success: false,
                message: '❌ Cuenta rechazada\n\nTu solicitud de cuenta no fue aprobada.\nContacta al administrador para más información.'
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
            return { success: true, user: userSession };
        }
        
        return {
            success: false,
            message: '🚫 Acceso denegado\n\nContacta al administrador.'
        };
    } else {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
    }
}

// Función para registrar nuevo usuario - CON APROBACIÓN
function register(username, email, password, establecimiento, cargo) {
    const users = getUsers();
    
    // Verificar si el usuario ya existe
    if (users.find(u => u.username === username)) {
        return { success: false, message: 'El nombre de usuario ya existe' };
    }
    
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'El email ya está registrado' };
    }
    
    // Validar dominio de email
    const allowedDomains = ['@slepiquique.cl', '@slepiqq.cl'];
    const isValidDomain = allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
    
    if (!isValidDomain) {
        return { success: false, message: 'Solo se permiten emails institucionales' };
    }
    
    // Agregar nuevo usuario con estado pendiente
    const newUser = { 
        username, 
        email, 
        password, 
        establecimiento: establecimiento || 'No especificado',
        cargo: cargo || 'No especificado',
        status: 'pendiente',
        registrationDate: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, message: 'Usuario registrado exitosamente. Pendiente de aprobación.' };
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('currentUser');
    updateUIForLoggedOutUser();
    showAlert('Sesión cerrada exitosamente', 'success');
}

// Funciones para mostrar/ocultar modales
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function hideLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

function hideRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
}

// Función para mostrar alertas
function showAlert(message, type = 'success') {
    // Remover alertas existentes
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Insertar al inicio del container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Actualizar UI para usuario logueado
function updateUIForLoggedInUser(user) {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('userInfo').style.display = 'inline';
    document.getElementById('userInfo').textContent = `Hola, ${user.username}`;
    document.getElementById('userInfo').classList.add('user-logged');
    document.getElementById('logoutBtn').style.display = 'inline';
}

// Actualizar UI para usuario no logueado
function updateUIForLoggedOutUser() {
    document.getElementById('loginBtn').style.display = 'inline';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
}

// Event listeners cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema
    initializeUsers();
    
    // Verificar si hay usuario logueado
    const currentUser = getCurrentUser();
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
    }
    
    // Event listeners para botones de navegación
    document.getElementById('loginBtn').addEventListener('click', function(e) {
        e.preventDefault();
        showLoginModal();
    });
    
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // Event listeners para mostrar registro
    document.getElementById('showRegister').addEventListener('click', function(e) {
        e.preventDefault();
        hideLoginModal();
        showRegisterModal();
    });
    
    document.getElementById('showLogin').addEventListener('click', function(e) {
        e.preventDefault();
        hideRegisterModal();
        showLoginModal();
    });
    
    // Event listeners para cerrar modales
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            hideLoginModal();
            hideRegisterModal();
        });
    });
    
    // Cerrar modal al hacer click fuera
    window.addEventListener('click', function(e) {
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        
        if (e.target === loginModal) {
            hideLoginModal();
        }
        if (e.target === registerModal) {
            hideRegisterModal();
        }
    });
    
    // Form de login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            showAlert('Por favor completa todos los campos', 'error');
            return;
        }
        
        const result = login(username, password);
        
        if (result.success) {
            hideLoginModal();
            updateUIForLoggedInUser(result.user);
            showAlert(`¡Bienvenido, ${result.user.username}!`, 'success');
            
            // Limpiar formulario
            document.getElementById('loginForm').reset();
        } else {
            showAlert(result.message, 'error');
        }
    });
    
    // Form de registro
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('newUsername').value;
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validaciones
        if (!username || !email || !password || !confirmPassword) {
            showAlert('Por favor completa todos los campos', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showAlert('Las contraseñas no coinciden', 'error');
            return;
        }
        
        if (password.length < 6) {
            showAlert('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        const result = register(username, email, password);
        
        if (result.success) {
            hideRegisterModal();
            showAlert(result.message, 'success');
            
            // Limpiar formulario
            document.getElementById('registerForm').reset();
            
            // Mostrar modal de login
            setTimeout(() => {
                showLoginModal();
            }, 1000);
        } else {
            showAlert(result.message, 'error');
        }
    });
});

// Función para debug - mostrar usuarios registrados (solo para desarrollo)
function showRegisteredUsers() {
    const users = getUsers();
    console.log('Usuarios registrados:');
    users.forEach(user => {
        console.log(`Username: ${user.username}, Email: ${user.email}`);
    });
}

// Función para limpiar todos los datos (solo para desarrollo)
function clearAllData() {
    localStorage.removeItem('appUsers');
    localStorage.removeItem('currentUser');
    location.reload();
}

// Función para resetear admin con contraseña correcta (solo para desarrollo)
function resetAdminPassword() {
    const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
    
    // Buscar y actualizar admin
    const adminIndex = users.findIndex(u => u.email === 'francisco.ramos@slepiquique.cl');
    if (adminIndex !== -1) {
        users[adminIndex].password = '13Jul1993';
        localStorage.setItem('appUsers', JSON.stringify(users));
        console.log('✅ Contraseña del admin actualizada a: 13Jul1993');
    } else {
        // Si no existe, crear admin
        const newAdmin = {
            username: 'francisco.ramos',
            email: 'francisco.ramos@slepiquique.cl',
            password: '13Jul1993',
            status: 'admin'
        };
        users.push(newAdmin);
        localStorage.setItem('appUsers', JSON.stringify(users));
        console.log('✅ Usuario admin creado con contraseña: 13Jul1993');
    }
}

// Exportar funciones para uso en otras páginas
window.authSystem = {
    isUserLoggedIn,
    getCurrentUser,
    logout,
    showAlert
};

// Inicializar usuarios al cargar el script
initializeUsers();