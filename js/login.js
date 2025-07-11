// Sistema de autenticación sin base de datos - Solo JavaScript y localStorage

// Usuarios predefinidos (simulando base de datos)
const defaultUsers = [
    { username: 'admin', email: 'admin@test.com', password: 'admin123' },
    { username: 'usuario1', email: 'user1@test.com', password: '123456' },
    { username: 'demo', email: 'demo@test.com', password: 'demo123' }
];

// Inicializar usuarios en localStorage si no existen
function initializeUsers() {
    if (!localStorage.getItem('appUsers')) {
        localStorage.setItem('appUsers', JSON.stringify(defaultUsers));
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

// Función para hacer login
function login(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Guardar usuario actual sin la contraseña
        const userSession = {
            username: user.username,
            email: user.email,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        return { success: true, user: userSession };
    } else {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
    }
}

// Función para registrar nuevo usuario
function register(username, email, password) {
    const users = getUsers();
    
    // Verificar si el usuario ya existe
    if (users.find(u => u.username === username)) {
        return { success: false, message: 'El nombre de usuario ya existe' };
    }
    
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'El email ya está registrado' };
    }
    
    // Agregar nuevo usuario
    const newUser = { username, email, password };
    users.push(newUser);
    saveUsers(users);
    
    return { success: true, message: 'Usuario registrado exitosamente' };
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

// Exportar funciones para uso en otras páginas
window.authSystem = {
    isUserLoggedIn,
    getCurrentUser,
    logout,
    showAlert
};