// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    if (!window.authSystem.isUserLoggedIn()) {
        alert('Debes iniciar sesión para acceder al dashboard');
        window.location.href = 'index.html';
        return;
    }

    const currentUser = window.authSystem.getCurrentUser();
    
    // Actualizar información del usuario en la navegación
    document.getElementById('userInfo').textContent = `Hola, ${currentUser.username}`;
    document.getElementById('userInfo').classList.add('user-logged');
    
    // Configurar botón de logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        window.authSystem.logout();
        window.location.href = 'index.html';
    });
    
    // Cargar estadísticas del dashboard
    loadDashboardStats();
    
    // Actualizar información de sesión
    updateSessionInfo();
    
    // Actualizar duración de sesión cada minuto
    setInterval(updateSessionDuration, 60000);
});

function loadDashboardStats() {
    // Obtener número total de usuarios registrados
    const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
    document.getElementById('totalUsers').textContent = users.length;
    
    // Simular otras estadísticas
    document.getElementById('sessionsToday').textContent = Math.floor(Math.random() * 10) + 1;
    document.getElementById('uptime').textContent = (95 + Math.random() * 5).toFixed(1) + '%';
    
    // Crear animación para los números
    animateNumbers();
}

function updateSessionInfo() {
    const currentUser = window.authSystem.getCurrentUser();
    if (!currentUser) return;
    
    document.getElementById('welcomeMessage').textContent = `Bienvenido, ${currentUser.username}`;
    document.getElementById('currentUsername').textContent = currentUser.username;
    document.getElementById('currentEmail').textContent = currentUser.email;
    
    // Formatear hora de login
    const loginTime = new Date(currentUser.loginTime);
    document.getElementById('loginTime').textContent = loginTime.toLocaleString('es-ES');
    
    updateSessionDuration();
}

function updateSessionDuration() {
    const currentUser = window.authSystem.getCurrentUser();
    if (!currentUser) return;
    
    const loginTime = new Date(currentUser.loginTime);
    const now = new Date();
    const duration = now - loginTime;
    
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    let durationText = '';
    if (hours > 0) {
        durationText = `${hours}h ${minutes}m`;
    } else {
        durationText = `${minutes}m`;
    }
    
    document.getElementById('sessionDuration').textContent = durationText;
}

function animateNumbers() {
    // Animar los números de estadísticas
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(element => {
        const finalValue = element.textContent;
        if (isNaN(parseInt(finalValue))) return;
        
        const finalNumber = parseInt(finalValue);
        element.textContent = '0';
        
        let currentNumber = 0;
        const increment = Math.ceil(finalNumber / 20);
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                element.textContent = finalValue;
                clearInterval(timer);
            } else {
                element.textContent = currentNumber;
            }
        }, 50);
    });
}

// Función para simular datos del gráfico (para futuras implementaciones)
function generateChartData() {
    const data = [];
    for (let i = 0; i < 7; i++) {
        data.push({
            day: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i],
            value: Math.floor(Math.random() * 100) + 20
        });
    }
    return data;
}

// Función para exportar datos (simulada)
function exportData() {
    const currentUser = window.authSystem.getCurrentUser();
    const data = {
        user: currentUser.username,
        exportDate: new Date().toISOString(),
        stats: {
            totalUsers: document.getElementById('totalUsers').textContent,
            sessionsToday: document.getElementById('sessionsToday').textContent,
            uptime: document.getElementById('uptime').textContent
        }
    };
    
    // Crear y descargar archivo JSON
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Agregar botón de exportación (opcional)
function addExportButton() {
    const header = document.querySelector('.header');
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Exportar Datos';
    exportBtn.className = 'btn-menu';
    exportBtn.style.marginTop = '1rem';
    exportBtn.onclick = exportData;
    header.appendChild(exportBtn);
}

// Llamar función para agregar botón de exportación
setTimeout(addExportButton, 1000);