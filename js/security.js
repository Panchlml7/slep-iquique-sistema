// Sistema de Seguridad del Proyecto SLEP IQUIQUE
// Solo el propietario puede acceder con la contraseña maestra

class ProjectSecurity {
    constructor() {
        this.masterKey = null;
        this.isAuthenticated = false;
        this.maxAttempts = 3;
        this.lockoutTime = 1// Auto-verificación en páginas sensibles
document.addEventListener('DOMContentLoaded', function() {
    const sensitivePaths = ['admin-usuarios.html', 'documentos'];
    const currentPath = window.location.pathname.toLowerCase();
    
    if (sensitivePaths.some(path => currentPath.includes(path))) {
        requireMasterAuth();
    }
});1000; // 15 minutos
        this.attempts = 0;
        this.lastAttempt = 0;
        this.onAuthSuccess = null; // Callback para después de autenticación exitosa
        
        this.initSecurity();
    }

    // Verificar si el proyecto está bloqueado
    isLocked() {
        const now = Date.now();
        if (this.attempts >= this.maxAttempts) {
            if (now - this.lastAttempt < this.lockoutTime) {
                return true;
            } else {
                // Reset después del tiempo de bloqueo
                this.attempts = 0;
                this.lastAttempt = 0;
            }
        }
        return false;
    }

    // Obtener tiempo restante de bloqueo
    getLockoutTimeRemaining() {
        if (!this.isLocked()) return 0;
        const now = Date.now();
        return Math.ceil((this.lockoutTime - (now - this.lastAttempt)) / 1000);
    }

    // Verificar contraseña maestra
    async verifyMasterPassword(inputPassword) {
        if (this.isLocked()) {
            throw new Error(`Sistema bloqueado. Intenta en ${this.getLockoutTimeRemaining()} segundos.`);
        }

        // Hash simple de la contraseña (en producción usar algo más seguro)
        const hashedInput = btoa(inputPassword + 'SLEP_IQUIQUE_2025');
        
        // Contraseña maestra predefinida (cambiar por la tuya)
        const masterHash = btoa('francisco.ramos.slep2025' + 'SLEP_IQUIQUE_2025');
        
        if (hashedInput === masterHash) {
            this.isAuthenticated = true;
            this.attempts = 0;
            this.lastAttempt = 0;
            this.storeMasterKey();
            return true;
        } else {
            this.attempts++;
            this.lastAttempt = Date.now();
            this.isAuthenticated = false;
            throw new Error(`Contraseña incorrecta. Intentos restantes: ${this.maxAttempts - this.attempts}`);
        }
    }

    // Almacenar clave maestra temporalmente (solo durante la sesión)
    storeMasterKey() {
        this.masterKey = btoa(Date.now().toString());
        sessionStorage.setItem('project_auth', this.masterKey);
    }

    // Verificar si está autenticado
    checkAuthentication() {
        const storedKey = sessionStorage.getItem('project_auth');
        if (storedKey && storedKey === this.masterKey) {
            this.isAuthenticated = true;
            return true;
        }
        return false;
    }

    // Cerrar sesión
    logout() {
        this.isAuthenticated = false;
        this.masterKey = null;
        sessionStorage.removeItem('project_auth');
    }

    // Inicializar sistema de seguridad
    initSecurity() {
        // Verificar si ya está autenticado
        if (this.checkAuthentication()) {
            return;
        }

        // Si no está en login.html, redirigir al login
        if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
            this.showMasterPasswordPrompt();
        }
    }

    // Mostrar prompt de contraseña maestra
    showMasterPasswordPrompt() {
        // Primero verificar si ya hay un modal activo
        const existingModal = document.querySelector('.security-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'security-modal';
        modal.innerHTML = `
            <div class="security-modal-content">
                <div class="security-header">
                    <h2>🔐 SISTEMA PROTEGIDO</h2>
                    <p>Este proyecto requiere autorización del propietario</p>
                    <p style="color: #ffeb3b; font-weight: bold;">⚠️ Solo Francisco Ramos puede acceder</p>
                </div>
                <div class="security-form">
                    <label for="masterPassword" style="color: white; display: block; margin-bottom: 10px;">Contraseña Maestra:</label>
                    <input type="password" id="masterPassword" placeholder="Ingresa la contraseña maestra" maxlength="50" style="width: 100%; padding: 12px; font-size: 16px; border-radius: 8px; border: 2px solid #4CAF50;">
                    <div style="margin: 15px 0;">
                        <button type="button" id="verifyBtn" style="background: #4CAF50; color: white; padding: 12px 20px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-right: 10px;">🔓 Verificar Acceso</button>
                        <button type="button" id="backBtn" style="background: #f44336; color: white; padding: 12px 20px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;">🚫 Cancelar</button>
                    </div>
                  
                </div>
                <div class="security-info">
                    <small>⚠️ Máximo 3 intentos - Bloqueo temporal por 15 minutos</small>
                </div>
                <div id="securityMessage" class="security-message"></div>
            </div>
        `;

        // Estilos del modal
        const style = document.createElement('style');
        style.textContent = `
            .security-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(10px);
            }
            .security-modal-content {
                background: linear-gradient(135deg, #000000ff 0%, #000000ff 100%);
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(201, 201, 201, 0.5);
                max-width: 400px;
                width: 90%;
                text-align: center;
                color: white;
            }
            .security-header h2 {
                margin: 0 0 0.5rem 0;
                color: #fff;
                font-size: 1.5rem;
            }
            .security-header p {
                margin: 0 0 1.5rem 0;
                opacity: 0.9;
            }
            .security-form input {
                width: 100%;
                padding: 1rem;
                margin-bottom: 1rem;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                box-sizing: border-box;
            }
            .security-form button {
                width: 48%;
                padding: 1rem;
                margin: 0.25rem 1%;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            #verifyBtn {
                background: #4CAF50;
                width: 100%;
                color: white;
            }
            #verifyBtn:hover {
                width: 100%;
                background: #45a049;
            }
            #backBtn {
                background: #f44336;
                width: 100%;
                color: white;
            }
            #backBtn:hover {
                width: 100%;
                background: #da190b;
            }
            .security-info {
                margin-top: 1rem;
                opacity: 0.8;
            }
            .security-message {
                margin-top: 1rem;
                padding: 0.5rem;
                border-radius: 5px;
                font-weight: bold;
            }
            .security-message.error {
                background: rgba(244, 67, 54, 0.2);
                color: #ffcdd2;
            }
            .security-message.success {
                background: rgba(76, 175, 80, 0.2);
                color: #c8e6c9;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Event listeners
        const passwordInput = document.getElementById('masterPassword');
        const verifyBtn = document.getElementById('verifyBtn');
        const backBtn = document.getElementById('backBtn');
        const messageDiv = document.getElementById('securityMessage');

        verifyBtn.addEventListener('click', async () => {
            const password = passwordInput.value.trim();
            if (!password) {
                this.showMessage(messageDiv, 'Ingresa la contraseña maestra', 'error');
                return;
            }

            try {
                await this.verifyMasterPassword(password);
                this.showMessage(messageDiv, '✅ Acceso autorizado', 'success');
                setTimeout(() => {
                    modal.remove();
                    // Ejecutar callback si existe
                    if (this.onAuthSuccess) {
                        this.onAuthSuccess();
                        this.onAuthSuccess = null; // Limpiar callback
                    }
                }, 1000);
            } catch (error) {
                this.showMessage(messageDiv, error.message, 'error');
                passwordInput.value = '';
            }
        });

        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // Enter key
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyBtn.click();
            }
        });

        // Focus en input
        setTimeout(() => passwordInput.focus(), 100);
    }

    // Mostrar mensaje
    showMessage(element, message, type) {
        element.textContent = message;
        element.className = `security-message ${type}`;
    }
}

// Instancia global del sistema de seguridad
window.projectSecurity = new ProjectSecurity();

// Función para verificar acceso en páginas administrativas
function requireMasterAuth() {
    if (!window.projectSecurity.checkAuthentication()) {
        window.projectSecurity.showMasterPasswordPrompt();
        return false;
    }
    return true;
}

// Auto-verificación en páginas sensibles
document.addEventListener('DOMContentLoaded', function() {
    const sensitivePaths = ['admin-usuarios.html'];
    const currentPath = window.location.pathname.toLowerCase();
    
    if (sensitivePaths.some(path => currentPath.includes(path))) {
        requireMasterAuth();
    }
});
