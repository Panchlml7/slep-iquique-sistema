/**
 * 👑 GESTIÓN DE PERFILES AUTORIZADOS - FRANCISCO RAMOS
 * Sistema exclusivo para que Francisco pueda promover usuarios a administradores
 */

class AuthorizedProfilesManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Verificar si el usuario actual es Francisco (Super Admin)
    isFranciscoSuperAdmin() {
        return this.currentUser && 
               this.currentUser.status === 'super_admin' && 
               this.currentUser.email === 'francisco.ramos@slepiquique.cl';
    }

    // Inicializar el sistema
    init() {
        if (!this.isFranciscoSuperAdmin()) {
            this.showAccessDenied();
            return;
        }
        
        // Crear usuarios de ejemplo si no existen
        this.createSampleUsersIfNeeded();
        
        this.loadInterface();
        this.loadUsers();
    }
    
    // Crear usuarios de ejemplo con información completa
    createSampleUsersIfNeeded() {
        const users = this.getUsers();
        
        // Verificar si ya existen usuarios de ejemplo
        const hasExampleUsers = users.some(u => u.email && u.email.includes('ejemplo'));
        
        if (!hasExampleUsers || users.filter(u => u.status !== 'admin' && u.status !== 'super_admin').length < 5) {
            console.log('🧪 Creando usuarios de ejemplo con información completa...');
            
            const sampleUsers = [
                {
                    username: 'carlos.rodriguez',
                    email: 'carlos.rodriguez@ejemplo.slepiquique.cl',
                    password: 'carlos456',
                    nombre: 'Carlos',
                    apellidoPaterno: 'Rodríguez',
                    apellidoMaterno: 'Mendoza',
                    nombreCompleto: 'Carlos Rodríguez Mendoza',
                    establecimiento: 'Escuela Básica Salvador Allende',
                    cargo: 'Director',
                    status: 'aprobada',
                    registrationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 días atrás
                    fechaAprobacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días atrás
                    aprobadoPor: 'Francisco Ramos',
                    telefono: '+56 9 1234 5678',
                    rut: '11.222.333-4'
                },
                {
                    username: 'ana.martinez',
                    email: 'ana.martinez@ejemplo.slepiquique.cl',
                    password: 'ana789',
                    nombre: 'Ana',
                    apellidoPaterno: 'Martínez',
                    apellidoMaterno: 'López',
                    nombreCompleto: 'Ana Martínez López',
                    establecimiento: 'Jardín Infantil Los Pequeños',
                    cargo: 'Educadora de Párvulos',
                    status: 'aprobada',
                    registrationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días atrás
                    fechaAprobacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 días atrás
                    aprobadoPor: 'Francisco Ramos',
                    telefono: '+56 9 9876 5432',
                    rut: '15.678.901-2'
                },
                {
                    username: 'pedro.sanchez',
                    email: 'pedro.sanchez@ejemplo.slepiquique.cl',
                    password: 'pedro2024',
                    nombre: 'Pedro',
                    apellidoPaterno: 'Sánchez',
                    apellidoMaterno: 'Herrera',
                    nombreCompleto: 'Pedro Sánchez Herrera',
                    establecimiento: 'Colegio Arturo Prat',
                    cargo: 'Profesor de Historia',
                    status: 'rechazada',
                    registrationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 días atrás
                    fechaRechazo: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 días atrás
                    rechazadoPor: 'Francisco Ramos',
                    motivoRechazo: 'Documentación incompleta',
                    telefono: '+56 9 5555 1234',
                    rut: '18.765.432-1'
                },
                {
                    username: 'lucia.torres',
                    email: 'lucia.torres@ejemplo.slepiquique.cl',
                    password: 'lucia555',
                    nombre: 'Lucía',
                    apellidoPaterno: 'Torres',
                    apellidoMaterno: 'Vargas',
                    nombreCompleto: 'Lucía Torres Vargas',
                    establecimiento: 'Liceo Bicentenario',
                    cargo: 'Psicóloga Educacional',
                    status: 'pendiente',
                    registrationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 día atrás
                    telefono: '+56 9 3333 7777',
                    rut: '19.876.543-2'
                },
                {
                    username: 'miguel.castro',
                    email: 'miguel.castro@ejemplo.slepiquique.cl',
                    password: 'miguel888',
                    nombre: 'Miguel',
                    apellidoPaterno: 'Castro',
                    apellidoMaterno: 'Ramírez',
                    nombreCompleto: 'Miguel Castro Ramírez',
                    establecimiento: 'Escuela Rural El Tamarugal',
                    cargo: 'Encargado de Convivencia',
                    status: 'aprobada',
                    registrationDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 días atrás
                    fechaAprobacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días atrás
                    aprobadoPor: 'Francisco Ramos',
                    telefono: '+56 9 4444 8888',
                    rut: '16.543.210-9'
                }
            ];
            
            // Agregar usuarios que no existan ya
            sampleUsers.forEach(sampleUser => {
                const exists = users.find(u => u.email === sampleUser.email || u.username === sampleUser.username);
                if (!exists) {
                    users.push(sampleUser);
                    console.log(`✅ Usuario creado: ${sampleUser.nombreCompleto} (${sampleUser.status})`);
                }
            });
            
            this.saveUsers(users);
            console.log(`🎯 Usuarios de ejemplo creados exitosamente`);
        }
    }

    // Mostrar mensaje de acceso denegado
    showAccessDenied() {
        const container = document.getElementById('authorized-profiles-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 15px; margin: 20px;">
                    <h2 style="color: #856404;">🚫 Acceso Denegado</h2>
                    <p style="font-size: 1.2rem; color: #856404;">
                        <strong>Solo Francisco Ramos puede gestionar Perfiles Autorizados</strong>
                    </p>
                    <p style="color: #6c757d;">
                        Esta función está restringida exclusivamente al Responsable de Perfiles Autorizados.
                    </p>
                    <button onclick="window.location.href='index.html'" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin-top: 15px; cursor: pointer;">
                        🏠 Volver al Inicio
                    </button>
                </div>
            `;
        }
    }

    // Cargar interfaz de gestión
    loadInterface() {
        const container = document.getElementById('authorized-profiles-container');
        if (container) {
            container.innerHTML = `
                <div class="super-admin-header">
                    <h1>👑 Gestión de Perfiles Autorizados</h1>
                    <p><strong>Responsable:</strong> Francisco Ramos | <strong>Rol:</strong> Super Administrador</p>
                    <div class="alert alert-info">
                        <strong>🔑 Permisos Exclusivos:</strong> Solo tú puedes promover usuarios a administradores y gestionar perfiles autorizados.
                    </div>
                </div>

                <div class="profile-management-tabs">
                    <button class="tab-btn active" onclick="authorizedProfilesManager.switchTab('pending-users')">
                        ⏳ Usuarios Pendientes
                    </button>
                    <button class="tab-btn" onclick="authorizedProfilesManager.switchTab('approved-users')">
                        ✅ Usuarios Aprobados
                    </button>
                    <button class="tab-btn" onclick="authorizedProfilesManager.switchTab('admin-users')">
                        👑 Administradores
                    </button>
                    <button class="tab-btn" onclick="authorizedProfilesManager.switchTab('detalle-usuarios')">
                        📊 Detalle de usuarios
                    </button>
                    
                </div>

                <div id="pending-users" class="tab-content active">
                    <h3>⏳ Usuarios Pendientes de Aprobación</h3>
                    <div id="pending-users-list"></div>
                </div>

                <div id="approved-users" class="tab-content">
                    <h3>✅ Usuarios Aprobados (Pueden ser promovidos)</h3>
                    <div id="approved-users-list"></div>
                </div>

                <div id="admin-users" class="tab-content">
                    <h3>👑 Administradores Actuales</h3>
                    <div id="admin-users-list"></div>
                </div>

                <div id="promote-to-admin" class="tab-content">
                    <h3>⬆️ Promover Usuario a Administrador</h3>
                    <div class="promote-section">
                        <p><strong>Solo Francisco puede realizar esta acción</strong></p>
                        <div id="promotion-interface"></div>
                    </div>
                </div>

                <div id="detalle-usuarios" class="tab-content">
                    <h3>📊 Detalle Completo de Usuarios</h3>
                    <div id="detalle-usuarios-content">
                        <!-- El contenido se cargará aquí dinámicamente -->
                    </div>
                </div>

                <div id="user-details-test" class="tab-content">
                    <h3>🧪 Detalle de usuarios (Test Avanzado)</h3>
                    <div class="test-section">
                        <div class="alert alert-info">
                            <strong>🔒 Área Privada:</strong> Funcionalidades avanzadas de testing para administración de usuarios.
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
                            
                            <!-- Test Modal de Usuarios -->
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #3b82f6;">
                                <h4 style="color: #3b82f6; margin: 0 0 15px 0;">👁️ Test Modal Detalle Usuario</h4>
                                <p style="color: #666; margin-bottom: 15px;">Probar funcionalidad de modal con información detallada</p>
                                <button onclick="authorizedProfilesManager.testUserDetailsModal()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; width: 100%;">
                                    🚀 Probar Modal
                                </button>
                            </div>
                            
                            <!-- Test Sistema de Usuarios -->
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #10b981;">
                                <h4 style="color: #10b981; margin: 0 0 15px 0;">🔧 Test Sistema Completo</h4>
                                <p style="color: #666; margin-bottom: 15px;">Verificar funcionamiento del sistema de usuarios</p>
                                <button onclick="authorizedProfilesManager.debugUserSystem()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; width: 100%;">
                                    🐛 Debug Sistema
                                </button>
                            </div>
                            
                            <!-- Test Autenticación -->
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b;">
                                <h4 style="color: #f59e0b; margin: 0 0 15px 0;">🔐 Test Autenticación</h4>
                                <p style="color: #666; margin-bottom: 15px;">Verificar permisos y sistema de login</p>
                                <button onclick="authorizedProfilesManager.testAuthentication()" style="background: #f59e0b; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; width: 100%;">
                                    🔍 Test Auth
                                </button>
                            </div>
                            
                            <!-- Test Avanzados -->
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #8b5cf6;">
                                <h4 style="color: #8b5cf6; margin: 0 0 15px 0;">⚡ Tests Avanzados</h4>
                                <p style="color: #666; margin-bottom: 15px;">Herramientas de testing avanzadas</p>
                                <button onclick="authorizedProfilesManager.runAdvancedTests()" style="background: #8b5cf6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; width: 100%;">
                                    🧪 Run Tests
                                </button>
                            </div>
                            
                        </div>
                        
                        <div id="test-results" style="margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 10px; display: none;">
                            <h4>📊 Resultados de Tests</h4>
                            <div id="test-output"></div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Cambiar pestañas
    switchTab(tabName) {
        // Ocultar todas las pestañas
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Desactivar todos los botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar pestaña activa
        const activeTab = document.getElementById(tabName);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Activar botón correspondiente
        event.target.classList.add('active');

        // Cargar contenido según la pestaña
        switch(tabName) {
            case 'pending-users':
                this.loadPendingUsers();
                break;
            case 'approved-users':
                this.loadApprovedUsers();
                break;
            case 'admin-users':
                this.loadAdminUsers();
                break;
            case 'promote-to-admin':
                this.loadPromotionInterface();
                break;
            case 'detalle-usuarios':
                this.loadDetalleUsuarios();
                break;
        }
    }

    // Cargar todos los usuarios
    loadUsers() {
        this.loadPendingUsers();
        this.loadApprovedUsers();
        this.loadAdminUsers();
        this.loadPromotionInterface();
    }

    // Obtener usuarios del localStorage
    getUsers() {
        return JSON.parse(localStorage.getItem('appUsers') || '[]');
    }

    // Guardar usuarios
    saveUsers(users) {
        localStorage.setItem('appUsers', JSON.stringify(users));
    }

    // Cargar usuarios pendientes
    loadPendingUsers() {
        const users = this.getUsers();
        const pendingUsers = users.filter(user => user.status === 'pendiente');
        const container = document.getElementById('pending-users-list');
        
        if (pendingUsers.length === 0) {
            container.innerHTML = '<p class="no-users">📭 No hay usuarios pendientes</p>';
            return;
        }

        let html = '';
        pendingUsers.forEach(user => {
            html += `
                <div class="user-card">
                    <div class="user-info">
                        <h4>${user.nombreCompleto || user.username}</h4>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Establecimiento:</strong> ${user.establecimiento || 'No especificado'}</p>
                        <p><strong>Cargo:</strong> ${user.cargo || 'No especificado'}</p>
                        <p><strong>Fecha registro:</strong> ${new Date(user.fechaRegistro).toLocaleDateString()}</p>
                    </div>
                    <div class="user-actions">
                        <button onclick="authorizedProfilesManager.approveUser('${user.email}')" class="btn btn-success">
                            ✅ Aprobar Usuario
                        </button>
                        <button onclick="authorizedProfilesManager.rejectUser('${user.email}')" class="btn btn-danger">
                            ❌ Rechazar
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Cargar usuarios aprobados
    loadApprovedUsers() {
        const users = this.getUsers();
        const approvedUsers = users.filter(user => user.status === 'aprobada');
        const container = document.getElementById('approved-users-list');
        
        if (approvedUsers.length === 0) {
            container.innerHTML = '<p class="no-users">📭 No hay usuarios aprobados</p>';
            return;
        }

        let html = '';
        approvedUsers.forEach(user => {
            html += `
                <div class="user-card">
                    <div class="user-info">
                        <h4>${user.nombreCompleto || user.username}</h4>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Establecimiento:</strong> ${user.establecimiento || 'No especificado'}</p>
                        <p><strong>Cargo:</strong> ${user.cargo || 'No especificado'}</p>
                    </div>
                    <div class="user-actions">
                        <button onclick="authorizedProfilesManager.promoteToAdmin('${user.email}')" class="btn btn-warning">
                            👑 Promover a Admin
                        </button>
                        <button onclick="authorizedProfilesManager.suspendUser('${user.email}')" class="btn btn-secondary">
                            ⏸️ Suspender
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Cargar usuarios administradores
    loadAdminUsers() {
        const users = this.getUsers();
        const adminUsers = users.filter(user => user.status === 'admin' || user.status === 'super_admin');
        const container = document.getElementById('admin-users-list');
        
        let html = '';
        adminUsers.forEach(user => {
            const isFrancisco = user.email === 'francisco.ramos@slepiquique.cl';
            const isSystemAdmin = user.email === 'admin@slepiquique.cl';
            
            html += `
                <div class="user-card admin-card">
                    <div class="user-info">
                        <h4>${user.nombreCompleto || user.username}</h4>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Rol:</strong> ${user.status === 'super_admin' ? '👑 Super Administrador (Responsable Perfiles)' : '👥 Administrador'}</p>
                        <p><strong>Establecimiento:</strong> ${user.establecimiento || 'SLEP Iquique'}</p>
                        ${isFrancisco ? '<p class="super-admin-badge">🔑 ÚNICO RESPONSABLE DE PERFILES AUTORIZADOS</p>' : ''}
                    </div>
                    <div class="user-actions">
                        ${!isFrancisco && !isSystemAdmin ? `
                            <button onclick="authorizedProfilesManager.demoteFromAdmin('${user.email}')" class="btn btn-warning">
                                ⬇️ Quitar Admin
                            </button>
                        ` : '<span class="protected-user">🛡️ Usuario Protegido</span>'}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Cargar interfaz de promoción
    loadPromotionInterface() {
        const users = this.getUsers();
        const eligibleUsers = users.filter(user => user.status === 'aprobada');
        const container = document.getElementById('promotion-interface');
        
        if (eligibleUsers.length === 0) {
            container.innerHTML = '<p class="no-users">📭 No hay usuarios elegibles para promoción</p>';
            return;
        }

        let html = `
            <div class="promotion-form">
                <label for="userToPromote">Seleccionar Usuario para Promover:</label>
                <select id="userToPromote" class="form-control">
                    <option value="">-- Seleccionar Usuario --</option>
        `;

        eligibleUsers.forEach(user => {
            html += `<option value="${user.email}">${user.nombreCompleto || user.username} (${user.email})</option>`;
        });

        html += `
                </select>
                <button onclick="authorizedProfilesManager.promoteSelectedUser()" class="btn btn-primary promotion-btn">
                    👑 Promover a Administrador
                </button>
            </div>
        `;

        container.innerHTML = html;
    }

    // Cargar vista detallada de usuarios (como la demo)
    loadDetalleUsuarios(searchTerm = '') {
        let users = this.getUsers().filter(u => u.status !== 'admin' && u.status !== 'super_admin');
        
        // Aplicar filtro de búsqueda si hay término de búsqueda
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase().trim();
            users = users.filter(user => {
                return (
                    (user.nombreCompleto || '').toLowerCase().includes(search) ||
                    (user.username || '').toLowerCase().includes(search) ||
                    (user.email || '').toLowerCase().includes(search) ||
                    (user.establecimiento || '').toLowerCase().includes(search) ||
                    (user.cargo || '').toLowerCase().includes(search) ||
                    (user.status || '').toLowerCase().includes(search)
                );
            });
        }
        
        const container = document.getElementById('detalle-usuarios-content');
        
        if (users.length === 0) {
            const message = searchTerm.trim() ? 
                `<div style="text-align: center; color: #6c757d; padding: 40px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🔍</div>
                    <h3>No se encontraron usuarios</h3>
                    <p>No hay usuarios que coincidan con "<strong>${searchTerm}</strong>"</p>
                    <button onclick="authorizedProfilesManager.clearSearch()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-top: 15px;">
                        🔄 Limpiar búsqueda
                    </button>
                </div>` :
                `<div style="text-align: center; color: #6c757d; padding: 40px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">👥</div>
                    <h3>No hay usuarios registrados</h3>
                    <p>Aún no se han registrado usuarios en el sistema.</p>
                </div>`;
            container.innerHTML = message;
            return;
        }

        // Función helper para obtener ícono de estado
        const getStatusIcon = (status) => {
            const icons = {
                'pendiente': '⏳',
                'aprobada': '✅',
                'rechazada': '❌'
            };
            return icons[status] || '❓';
        };

        // Función helper para formatear fechas
        const formatDate = (dateString) => {
            if (!dateString) return 'No disponible';
            return new Date(dateString).toLocaleString('es-CL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        // Estadísticas
        const estadisticas = {
            total: users.length,
            pendientes: users.filter(u => u.status === 'pendiente').length,
            aprobados: users.filter(u => u.status === 'aprobada').length,
            rechazados: users.filter(u => u.status === 'rechazada').length
        };

        const usersHTML = `
            <style>
                .user-grid-detalle {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
                    gap: 25px;
                    margin-bottom: 30px;
                }

                .user-card-detalle {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: 15px;
                    padding: 25px;
                    border-left: 5px solid #667eea;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease;
                }

                .user-card-detalle:hover {
                    transform: translateY(-5px);
                }

                .user-header-detalle {
                    text-align: center;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #e9ecef;
                }

                .user-avatar-detalle {
                    font-size: 3rem;
                    margin-bottom: 10px;
                }

                .user-name-detalle {
                    color: #667eea;
                    font-size: 1.4rem;
                    font-weight: bold;
                    margin: 0;
                }

                .user-status-detalle {
                    padding: 6px 15px;
                    border-radius: 15px;
                    font-weight: bold;
                    font-size: 0.9rem;
                    margin-top: 8px;
                    display: inline-block;
                }

                .status-pendiente {
                    background: #fef3c7;
                    color: #92400e;
                }

                .status-aprobada {
                    background: #d1fae5;
                    color: #065f46;
                }

                .status-rechazada {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .user-details-detalle {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .detail-section-detalle {
                    background: white;
                    padding: 15px;
                    border-radius: 10px;
                    border: 1px solid #e5e7eb;
                }

                .detail-section-detalle h4 {
                    margin: 0 0 15px 0;
                    color: #374151;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .detail-item-detalle {
                    margin-bottom: 10px;
                    display: flex;
                    flex-direction: column;
                }

                .detail-label-detalle {
                    font-weight: bold;
                    color: #6b7280;
                    font-size: 0.9rem;
                    margin-bottom: 2px;
                }

                .detail-value-detalle {
                    color: #374151;
                    font-size: 1rem;
                }

                .password-section-detalle {
                    grid-column: span 2;
                    background: #fef3c7;
                    border: 2px solid #fbbf24;
                }

                .password-container-detalle {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 10px;
                }

                .password-display-detalle {
                    font-family: 'Courier New', monospace;
                    background: white;
                    padding: 10px 15px;
                    border-radius: 8px;
                    border: 2px solid #e5e7eb;
                    flex: 1;
                    font-weight: bold;
                    letter-spacing: 1px;
                }

                .toggle-btn-detalle {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }

                .toggle-btn-detalle:hover {
                    background: #2563eb;
                }

                .toggle-btn-detalle.showing {
                    background: #ef4444;
                }

                .toggle-btn-detalle.showing:hover {
                    background: #dc2626;
                }

                .actions-detalle {
                    grid-column: span 2;
                    text-align: center;
                    margin-top: 15px;
                }

                .btn-detalle {
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    margin: 0 5px;
                    transition: all 0.3s ease;
                }

                .btn-detalle:hover {
                    background: #059669;
                }

                .summary-detalle {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 15px;
                    text-align: center;
                    margin-bottom: 30px;
                }

                .stats-grid-detalle {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .stat-item-detalle {
                    background: rgba(255,255,255,0.2);
                    padding: 15px;
                    border-radius: 10px;
                }

                .stat-number-detalle {
                    font-size: 2rem;
                    font-weight: bold;
                }

                .stat-label-detalle {
                    font-size: 0.9rem;
                    opacity: 0.9;
                }

                .search-container-detalle {
                    background: white;
                    padding: 20px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    border: 2px solid #e9ecef;
                }

                .search-input-detalle {
                    width: 100%;
                    padding: 15px 20px;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                    background: #f8f9fa;
                }

                .search-input-detalle:focus {
                    outline: none;
                    border-color: #667eea;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .search-controls-detalle {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .search-info-detalle {
                    color: #6b7280;
                    font-size: 0.9rem;
                    flex: 1;
                    margin-top: 5px;
                }

                .search-buttons-detalle {
                    display: flex;
                    gap: 10px;
                }

                .search-btn-detalle {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }

                .search-btn-detalle:hover {
                    background: #2563eb;
                }

                .search-btn-detalle.clear {
                    background: #6b7280;
                }

                .search-btn-detalle.clear:hover {
                    background: #4b5563;
                }

                .search-results-info {
                    background: #e0f2fe;
                    color: #0277bd;
                    padding: 10px 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-weight: bold;
                    text-align: center;
                }

                @media (max-width: 768px) {
                    .user-grid-detalle {
                        grid-template-columns: 1fr;
                    }
                    
                    .user-details-detalle {
                        grid-template-columns: 1fr;
                    }
                    
                    .password-section-detalle {
                        grid-column: span 1;
                    }

                    .search-controls-detalle {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .search-info-detalle {
                        order: 1;
                        text-align: center;
                        margin-top: 10px;
                    }

                    .search-buttons-detalle {
                        order: 0;
                        justify-content: center;
                    }
                }
            </style>

            <!-- Header con estadísticas -->
            <div class="summary-detalle">
                <h2 style="margin: 0 0 15px 0; font-size: 2rem;">📊 Información Completa de Usuarios</h2>
                <p style="margin: 0 0 20px 0; opacity: 0.9;">Vista detallada con toda la información incluyendo contraseñas</p>
                <div class="stats-grid-detalle">
                    <div class="stat-item-detalle">
                        <div class="stat-number-detalle">${estadisticas.total}</div>
                        <div class="stat-label-detalle">Total</div>
                    </div>
                    <div class="stat-item-detalle">
                        <div class="stat-number-detalle">${estadisticas.pendientes}</div>
                        <div class="stat-label-detalle">⏳ Pendientes</div>
                    </div>
                    <div class="stat-item-detalle">
                        <div class="stat-number-detalle">${estadisticas.aprobados}</div>
                        <div class="stat-label-detalle">✅ Aprobados</div>
                    </div>
                    <div class="stat-item-detalle">
                        <div class="stat-number-detalle">${estadisticas.rechazados}</div>
                        <div class="stat-label-detalle">❌ Rechazados</div>
                    </div>
                </div>
            </div>

            <!-- Buscador de usuarios -->
            <div class="search-container-detalle">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="font-size: 1.5rem;">🔍</div>
                    <h3 style="margin: 0; color: #374151;">Buscar Usuarios</h3>
                </div>
                
                <input 
                    type="text" 
                    id="searchInput-detalle"
                    class="search-input-detalle"
                    placeholder="Buscar por nombre, email, establecimiento, cargo, RUT, teléfono o estado..."
                    value="${searchTerm}"
                    onkeyup="authorizedProfilesManager.handleSearchKeyup(event)"
                    autocomplete="off"
                >
                
                <div class="search-controls-detalle">
                    <div class="search-info-detalle">
                        💡 Busca por cualquier campo: nombre completo, usuario, email, establecimiento, cargo
                    </div>
                    <div class="search-buttons-detalle">
                        <button class="search-btn-detalle" onclick="authorizedProfilesManager.performSearch()">
                            🔍 Buscar
                        </button>
                        <button class="search-btn-detalle clear" onclick="authorizedProfilesManager.clearSearch()">
                            🔄 Limpiar
                        </button>
                    </div>
                </div>
            </div>

            ${searchTerm.trim() ? `
                <div class="search-results-info">
                    🎯 Mostrando ${users.length} resultado${users.length !== 1 ? 's' : ''} para "${searchTerm}"
                </div>
            ` : ''}

            <!-- Filtros rápidos -->
            <div style="
                background: white;
                padding: 15px 20px;
                border-radius: 10px;
                margin-bottom: 25px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                border: 1px solid #e5e7eb;
            ">
                <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                    <div style="font-weight: bold; color: #374151; display: flex; align-items: center; gap: 5px;">
                        ⚡ Filtros rápidos:
                    </div>
                    <button onclick="authorizedProfilesManager.searchByStatus('pendiente')" style="
                        background: #fef3c7;
                        color: #92400e;
                        border: 2px solid #fbbf24;
                        padding: 6px 12px;
                        border-radius: 15px;
                        font-weight: bold;
                        font-size: 0.85rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#fbbf24'; this.style.color='white';" onmouseout="this.style.background='#fef3c7'; this.style.color='#92400e';">
                        ⏳ Pendientes
                    </button>
                    <button onclick="authorizedProfilesManager.searchByStatus('aprobada')" style="
                        background: #d1fae5;
                        color: #065f46;
                        border: 2px solid #10b981;
                        padding: 6px 12px;
                        border-radius: 15px;
                        font-weight: bold;
                        font-size: 0.85rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#10b981'; this.style.color='white';" onmouseout="this.style.background='#d1fae5'; this.style.color='#065f46';">
                        ✅ Aprobados
                    </button>
                    <button onclick="authorizedProfilesManager.searchByStatus('rechazada')" style="
                        background: #fee2e2;
                        color: #991b1b;
                        border: 2px solid #ef4444;
                        padding: 6px 12px;
                        border-radius: 15px;
                        font-weight: bold;
                        font-size: 0.85rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#ef4444'; this.style.color='white';" onmouseout="this.style.background='#fee2e2'; this.style.color='#991b1b';">
                        ❌ Rechazados
                    </button>
                    <button onclick="authorizedProfilesManager.clearSearch()" style="
                        background: #f3f4f6;
                        color: #374151;
                        border: 2px solid #9ca3af;
                        padding: 6px 12px;
                        border-radius: 15px;
                        font-weight: bold;
                        font-size: 0.85rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#9ca3af'; this.style.color='white';" onmouseout="this.style.background='#f3f4f6'; this.style.color='#374151';">
                        🔄 Todos
                    </button>
                </div>
                <div style="margin-top: 10px; font-size: 0.85rem; color: #6b7280;">
                    💡 Haz clic en un filtro para ver solo usuarios con ese estado, o usa el buscador para términos específicos
                </div>
            </div>

            <div class="user-grid-detalle">
                ${users.map(user => `
                    <div class="user-card-detalle">
                        <div class="user-header-detalle">
                            <div class="user-avatar-detalle">👤</div>
                            <h3 class="user-name-detalle">${user.nombreCompleto || user.username}</h3>
                            <div class="user-status-detalle status-${user.status}">
                                ${getStatusIcon(user.status)} ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </div>
                        </div>

                        <div class="user-details-detalle">
                            <!-- Datos Personales -->
                            <div class="detail-section-detalle">
                                <h4><span style="font-size: 1.2rem;">👤</span> Datos Personales</h4>
                                <div class="detail-item-detalle">
                                    <div class="detail-label-detalle">Usuario:</div>
                                    <div class="detail-value-detalle"><code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${user.username}</code></div>
                                </div>
                                <div class="detail-item-detalle">
                                    <div class="detail-label-detalle">Email:</div>
                                    <div class="detail-value-detalle" style="color: #3b82f6;">${user.email}</div>
                                </div>
                                ${user.rut ? `
                                <div class="detail-item-detalle">
                                    <div class="detail-label-detalle">RUT:</div>
                                    <div class="detail-value-detalle">${user.rut}</div>
                                </div>
                                ` : ''}
                                ${user.telefono ? `
                                <div class="detail-item-detalle">
                                    <div class="detail-label-detalle">Teléfono:</div>
                                    <div class="detail-value-detalle">${user.telefono}</div>
                                </div>
                                ` : ''}
                            </div>

                            <!-- Información Profesional -->
                            <div class="detail-section-detalle">
                                <h4><span style="font-size: 1.2rem;">🏢</span> Información Profesional</h4>
                                <div class="detail-item-detalle">
                                    <div class="detail-label-detalle">Establecimiento:</div>
                                    <div class="detail-value-detalle">${user.establecimiento || 'No especificado'}</div>
                                </div>
                                <div class="detail-item-detalle">
                                    <div class="detail-label-detalle">Cargo:</div>
                                    <div class="detail-value-detalle">${user.cargo || 'No especificado'}</div>
                                </div>
                                <div class="detail-item-detalle">
                                    <div class="detail-label-detalle">Fecha de Registro:</div>
                                    <div class="detail-value-detalle">${formatDate(user.registrationDate)}</div>
                                </div>
                                ${user.fechaAprobacion ? `
                                <div class="detail-item-detalle">
                                    <div class="detail-label-detalle">Fecha de Aprobación:</div>
                                    <div class="detail-value-detalle" style="color: #059669;">${formatDate(user.fechaAprobacion)}</div>
                                </div>
                                ` : ''}
                                ${user.fechaRechazo ? `
                                <div class="detail-item-detalle">
                                    <div class="detail-label-detalle">Fecha de Rechazo:</div>
                                    <div class="detail-value-detalle" style="color: #dc2626;">${formatDate(user.fechaRechazo)}</div>
                                </div>
                                ${user.motivoRechazo ? `
                                <div class="detail-item-detalle">
                                    <div class="detail-label-detalle">Motivo:</div>
                                    <div class="detail-value-detalle" style="color: #dc2626;">${user.motivoRechazo}</div>
                                </div>
                                ` : ''}
                                ` : ''}
                            </div>

                            <!-- Contraseña -->
                            <div class="detail-section-detalle password-section-detalle">
                                <h4><span style="font-size: 1.2rem;">🔐</span> Información Confidencial</h4>
                                <div class="detail-label-detalle">Contraseña:</div>
                                <div class="password-container-detalle">
                                    <div class="password-display-detalle" id="password_detalle_${user.username}">••••••••</div>
                                    <button class="toggle-btn-detalle" id="toggle_detalle_${user.username}" onclick="authorizedProfilesManager.togglePasswordDetalle('${user.username}', '${user.password || 'N/A'}')">
                                        👁️ Mostrar
                                    </button>
                                </div>
                            </div>

                            <!-- Acciones -->
                            <div class="actions-detalle">
                                <button class="btn-detalle" onclick="authorizedProfilesManager.copyUserInfo('${user.username}')">
                                    📋 Copiar Información
                                </button>
                                ${user.status === 'pendiente' ? `
                                    <button class="btn-detalle" onclick="authorizedProfilesManager.quickApproveUser('${user.username}')" style="background: #28a745;">
                                        ✅ Aprobar
                                    </button>
                                    <button class="btn-detalle" onclick="authorizedProfilesManager.quickRejectUser('${user.username}')" style="background: #dc3545;">
                                        ❌ Rechazar
                                    </button>
                                ` : ''}
                                ${user.status === 'aprobada' ? `
                                    <button class="btn-detalle" onclick="authorizedProfilesManager.quickPromoteUser('${user.username}')" style="background: #ffc107; color: #212529;">
                                        👑 Promover
                                    </button>
                                ` : ''}
                                ${user.status === 'rechazada' ? `
                                    <button class="btn-detalle" onclick="authorizedProfilesManager.quickApproveUser('${user.username}')" style="background: #28a745;">
                                        ✅ Revisar
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = usersHTML;
    }

    // Función para alternar contraseña en vista detalle
    togglePasswordDetalle(username, password) {
        const passwordDisplay = document.getElementById(`password_detalle_${username}`);
        const toggleBtn = document.getElementById(`toggle_detalle_${username}`);

        if (!passwordDisplay || !toggleBtn) return;

        if (passwordDisplay.textContent === '••••••••') {
            passwordDisplay.textContent = password;
            passwordDisplay.style.background = '#fef3c7';
            passwordDisplay.style.color = '#92400e';
            passwordDisplay.style.borderColor = '#fbbf24';
            toggleBtn.textContent = '🙈 Ocultar';
            toggleBtn.classList.add('showing');
        } else {
            passwordDisplay.textContent = '••••••••';
            passwordDisplay.style.background = 'white';
            passwordDisplay.style.color = '#374151';
            passwordDisplay.style.borderColor = '#e5e7eb';
            toggleBtn.textContent = '👁️ Mostrar';
            toggleBtn.classList.remove('showing');
        }
    }

    // Función para aprobar usuario rápidamente
    quickApproveUser(username) {
        if (confirm(`¿Aprobar usuario ${username}?`)) {
            const users = this.getUsers();
            const userIndex = users.findIndex(u => u.username === username);
            
            if (userIndex !== -1) {
                users[userIndex].status = 'aprobada';
                users[userIndex].fechaAprobacion = new Date().toISOString();
                localStorage.setItem('usuarios', JSON.stringify(users));
                
                // Mantener la búsqueda activa
                const searchInput = document.getElementById('searchInput-detalle');
                const currentSearch = searchInput ? searchInput.value : '';
                this.loadDetalleUsuarios(currentSearch);
                
                alert(`✅ Usuario ${username} aprobado exitosamente`);
            }
        }
    }

    // Función para rechazar usuario rápidamente
    quickRejectUser(username) {
        const motivo = prompt(`¿Motivo del rechazo para ${username}?`, 'No cumple con los requisitos');
        if (motivo) {
            const users = this.getUsers();
            const userIndex = users.findIndex(u => u.username === username);
            
            if (userIndex !== -1) {
                users[userIndex].status = 'rechazada';
                users[userIndex].fechaRechazo = new Date().toISOString();
                users[userIndex].motivoRechazo = motivo;
                localStorage.setItem('usuarios', JSON.stringify(users));
                
                // Mantener la búsqueda activa
                const searchInput = document.getElementById('searchInput-detalle');
                const currentSearch = searchInput ? searchInput.value : '';
                this.loadDetalleUsuarios(currentSearch);
                
                alert(`❌ Usuario ${username} rechazado: ${motivo}`);
            }
        }
    }

    // Función para promover usuario rápidamente
    quickPromoteUser(username) {
        if (confirm(`¿Promover a ${username} a administrador?`)) {
            const users = this.getUsers();
            const userIndex = users.findIndex(u => u.username === username);
            
            if (userIndex !== -1) {
                users[userIndex].status = 'admin';
                users[userIndex].fechaPromocion = new Date().toISOString();
                localStorage.setItem('usuarios', JSON.stringify(users));
                
                // Mantener la búsqueda activa
                const searchInput = document.getElementById('searchInput-detalle');
                const currentSearch = searchInput ? searchInput.value : '';
                this.loadDetalleUsuarios(currentSearch);
                
                alert(`👑 Usuario ${username} promovido a administrador`);
            }
        }
    }

    // ===== FUNCIONES DE BÚSQUEDA =====

    // Manejar teclas en el buscador
    handleSearchKeyup(event) {
        if (event.key === 'Enter') {
            this.performSearch();
        } else if (event.key === 'Escape') {
            this.clearSearch();
        }
    }

    // Realizar búsqueda
    performSearch() {
        const searchInput = document.getElementById('searchInput-detalle');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.trim();
        this.loadDetalleUsuarios(searchTerm);
        
        // Agregar a historial de búsquedas (opcional)
        if (searchTerm) {
            this.addToSearchHistory(searchTerm);
        }
    }

    // Limpiar búsqueda
    clearSearch() {
        const searchInput = document.getElementById('searchInput-detalle');
        if (searchInput) {
            searchInput.value = '';
        }
        this.loadDetalleUsuarios(); // Cargar todos los usuarios
    }

    // Agregar término a historial de búsquedas
    addToSearchHistory(searchTerm) {
        try {
            let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            
            // Evitar duplicados
            history = history.filter(term => term.toLowerCase() !== searchTerm.toLowerCase());
            
            // Agregar al inicio
            history.unshift(searchTerm);
            
            // Mantener solo los últimos 10
            history = history.slice(0, 10);
            
            localStorage.setItem('searchHistory', JSON.stringify(history));
        } catch (error) {
            console.warn('No se pudo guardar el historial de búsqueda:', error);
        }
    }

    // Obtener historial de búsquedas
    getSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem('searchHistory') || '[]');
        } catch (error) {
            return [];
        }
    }

    // Buscar por filtros específicos
    searchByStatus(status) {
        const searchInput = document.getElementById('searchInput-detalle');
        if (searchInput) {
            searchInput.value = status;
        }
        this.loadDetalleUsuarios(status);
    }

    // Búsqueda avanzada con múltiples criterios
    advancedSearch(criteria) {
        const users = this.getUsers().filter(u => u.status !== 'admin' && u.status !== 'super_admin');
        
        const filteredUsers = users.filter(user => {
            let matches = true;
            
            if (criteria.nombre && !user.nombreCompleto?.toLowerCase().includes(criteria.nombre.toLowerCase())) {
                matches = false;
            }
            
            if (criteria.email && !user.email?.toLowerCase().includes(criteria.email.toLowerCase())) {
                matches = false;
            }
            
            if (criteria.establecimiento && !user.establecimiento?.toLowerCase().includes(criteria.establecimiento.toLowerCase())) {
                matches = false;
            }
            
            if (criteria.status && user.status !== criteria.status) {
                matches = false;
            }
            
            if (criteria.cargo && !user.cargo?.toLowerCase().includes(criteria.cargo.toLowerCase())) {
                matches = false;
            }
            
            return matches;
        });
        
        return filteredUsers;
    }

    // Aprobar usuario
    approveUser(email) {
        if (!this.isFranciscoSuperAdmin()) {
            alert('🚫 Solo Francisco puede aprobar usuarios');
            return;
        }

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.email === email);
        
        if (userIndex !== -1) {
            users[userIndex].status = 'aprobada';
            users[userIndex].fechaAprobacion = new Date().toISOString();
            users[userIndex].aprobadoPor = 'Francisco Ramos';
            
            this.saveUsers(users);
            alert(`✅ Usuario ${users[userIndex].nombreCompleto} aprobado exitosamente`);
            this.loadUsers();
        }
    }

    // Rechazar usuario
    rejectUser(email) {
        if (!this.isFranciscoSuperAdmin()) {
            alert('🚫 Solo Francisco puede rechazar usuarios');
            return;
        }

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.email === email);
        
        if (userIndex !== -1) {
            if (confirm(`¿Seguro que deseas rechazar a ${users[userIndex].nombreCompleto}?`)) {
                users[userIndex].status = 'rechazada';
                users[userIndex].fechaRechazo = new Date().toISOString();
                users[userIndex].rechazadoPor = 'Francisco Ramos';
                
                this.saveUsers(users);
                alert(`❌ Usuario ${users[userIndex].nombreCompleto} rechazado`);
                this.loadUsers();
            }
        }
    }

    // Promover a administrador
    promoteToAdmin(email) {
        if (!this.isFranciscoSuperAdmin()) {
            alert('🚫 Solo Francisco puede promover usuarios a administrador');
            return;
        }

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.email === email);
        
        if (userIndex !== -1) {
            if (confirm(`¿Seguro que deseas promover a ${users[userIndex].nombreCompleto} a Administrador?`)) {
                users[userIndex].status = 'admin';
                users[userIndex].role = 'admin';
                users[userIndex].fechaPromocion = new Date().toISOString();
                users[userIndex].promocionadoPor = 'Francisco Ramos';
                
                this.saveUsers(users);
                alert(`👑 ${users[userIndex].nombreCompleto} promovido a Administrador exitosamente`);
                this.loadUsers();
            }
        }
    }

    // Promover usuario seleccionado
    promoteSelectedUser() {
        const select = document.getElementById('userToPromote');
        const email = select.value;
        
        if (!email) {
            alert('⚠️ Selecciona un usuario para promover');
            return;
        }

        this.promoteToAdmin(email);
    }

    // Quitar administrador
    demoteFromAdmin(email) {
        if (!this.isFranciscoSuperAdmin()) {
            alert('🚫 Solo Francisco puede quitar permisos de administrador');
            return;
        }

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.email === email);
        
        if (userIndex !== -1) {
            if (confirm(`¿Seguro que deseas quitar permisos de administrador a ${users[userIndex].nombreCompleto}?`)) {
                users[userIndex].status = 'aprobada';
                users[userIndex].role = 'user';
                users[userIndex].fechaDemocion = new Date().toISOString();
                users[userIndex].degradadoPor = 'Francisco Ramos';
                
                this.saveUsers(users);
                alert(`⬇️ ${users[userIndex].nombreCompleto} ya no es administrador`);
                this.loadUsers();
            }
        }
    }

    // ===== FUNCIONES DE TEST AVANZADO =====
    
    // Test Modal de Usuario - Versión Avanzada con Detalle Completo
    testUserDetailsModal() {
        this.showTestResults('🧪 Test Modal de Usuario', 'Iniciando test...');
        
        try {
            // Crear usuarios de prueba si no existen
            const users = this.getUsers();
            const testUsers = [
                {
                    username: 'test-advanced',
                    email: 'test.advanced@slepiquique.cl', 
                    nombreCompleto: 'Usuario Test Avanzado',
                    password: 'test123',
                    status: 'aprobada',
                    establecimiento: 'Centro de Testing',
                    cargo: 'Tester Avanzado',
                    registrationDate: new Date().toISOString()
                },
                {
                    username: 'demo-user',
                    email: 'demo@slepiquique.cl',
                    nombreCompleto: 'Usuario Demo',
                    password: 'demo456',
                    status: 'pendiente',
                    establecimiento: 'Liceo Demo',
                    cargo: 'Profesor',
                    registrationDate: new Date(Date.now() - 86400000).toISOString()
                }
            ];
            
            // Agregar usuarios de prueba si no existen
            testUsers.forEach(testUser => {
                if (!users.find(u => u.email === testUser.email)) {
                    users.push(testUser);
                }
            });
            this.saveUsers(users);
            
            // Mostrar modal avanzado con selección de usuario
            this.showAdvancedUserDetailsModal();
            this.updateTestResults('✅ Modal avanzado mostrado exitosamente');
            
        } catch (error) {
            this.updateTestResults(`❌ Error en test: ${error.message}`);
        }
    }
    
    // Mostrar Modal Avanzado de Detalles de Usuario
    showAdvancedUserDetailsModal() {
        // Crear modal si no existe
        let modal = document.getElementById('advancedUserModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'advancedUserModal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            document.body.appendChild(modal);
        }
        
        const users = this.getUsers().filter(u => u.status !== 'admin' && u.status !== 'super_admin');
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 15px;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 15px 15px 0 0;
                    position: relative;
                ">
                    <h2 style="margin: 0; font-size: 1.5rem;">🔐 Detalles Confidenciales de Usuarios</h2>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Acceso exclusivo para Francisco Ramos - Super Admin</p>
                    <button onclick="this.closest('#advancedUserModal').remove()" style="
                        position: absolute;
                        top: 15px;
                        right: 20px;
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        font-size: 1.5rem;
                        width: 35px;
                        height: 35px;
                        border-radius: 50%;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">&times;</button>
                </div>
                
                <div style="padding: 20px;">
                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; color: #333; display: block; margin-bottom: 10px;">
                            👤 Seleccionar Usuario para Ver Detalles:
                        </label>
                        <select id="userSelectModal" onchange="authorizedProfilesManager.showSelectedUserDetails(this.value)" style="
                            width: 100%;
                            padding: 12px;
                            border: 2px solid #e2e8f0;
                            border-radius: 8px;
                            font-size: 1rem;
                            background: white;
                        ">
                            <option value="">-- Seleccionar Usuario --</option>
                            ${users.map(user => `
                                <option value="${user.username}">
                                    ${user.nombreCompleto || user.username} (${user.status}) - ${user.email}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div id="selectedUserDetails" style="
                        background: #f8f9fa;
                        border-radius: 10px;
                        padding: 20px;
                        margin-top: 20px;
                        border: 2px solid #e2e8f0;
                        min-height: 200px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #6c757d;
                    ">
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 15px;">👤</div>
                            <p>Selecciona un usuario para ver sus detalles completos</p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <button onclick="authorizedProfilesManager.showAllUsersDetails()" style="
                            background: #28a745;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            font-weight: bold;
                            cursor: pointer;
                            margin-right: 10px;
                        ">📊 Ver Todos los Usuarios</button>
                        
                        <button onclick="this.closest('#advancedUserModal').remove()" style="
                            background: #6c757d;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            font-weight: bold;
                            cursor: pointer;
                        ">Cerrar</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }
    
    // Mostrar detalles del usuario seleccionado
    showSelectedUserDetails(username) {
        if (!username) {
            document.getElementById('selectedUserDetails').innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">👤</div>
                    <p>Selecciona un usuario para ver sus detalles completos</p>
                </div>
            `;
            return;
        }
        
        const users = this.getUsers();
        const user = users.find(u => u.username === username);
        
        if (!user) {
            document.getElementById('selectedUserDetails').innerHTML = `
                <div style="text-align: center; color: #dc3545;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">❌</div>
                    <p>Usuario no encontrado</p>
                </div>
            `;
            return;
        }
        
        // Función helper para formatear fechas
        const formatDate = (dateString) => {
            if (!dateString) return 'No disponible';
            return new Date(dateString).toLocaleString('es-CL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };
        
        // Determinar color del estado
        const getStatusColor = (status) => {
            const colors = {
                'pendiente': { bg: '#fef3c7', color: '#92400e', icon: '⏳' },
                'aprobada': { bg: '#d1fae5', color: '#065f46', icon: '✅' },
                'rechazada': { bg: '#fee2e2', color: '#991b1b', icon: '❌' },
                'admin': { bg: '#dbeafe', color: '#1e40af', icon: '👑' }
            };
            return colors[status] || { bg: '#f3f4f6', color: '#374151', icon: '❓' };
        };
        
        const statusInfo = getStatusColor(user.status);
        
        const detailsHTML = `
            <div style="width: 100%;">
                <div style="
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: 15px;
                    padding: 25px;
                    border-left: 5px solid #667eea;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                ">
                    <!-- Header del Usuario -->
                    <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e9ecef;">
                        <div style="font-size: 4rem; margin-bottom: 10px;">👤</div>
                        <h2 style="color: #667eea; margin: 0 0 10px 0; font-size: 1.8rem;">
                            ${user.nombreCompleto || user.username}
                        </h2>
                        <span style="
                            background: ${statusInfo.bg};
                            color: ${statusInfo.color};
                            padding: 8px 20px;
                            border-radius: 20px;
                            font-weight: bold;
                            font-size: 1rem;
                            display: inline-block;
                        ">
                            ${statusInfo.icon} ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                    </div>
                    
                    <!-- Información organizada en secciones -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
                        
                        <!-- Sección: Datos Personales -->
                        <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <h4 style="color: #3b82f6; margin: 0 0 20px 0; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.5rem;">👤</span> Datos Personales
                            </h4>
                            <div style="space-y: 12px;">
                                <div style="margin-bottom: 12px;">
                                    <label style="font-weight: bold; color: #374151; display: block; margin-bottom: 4px;">Nombre Completo:</label>
                                    <span style="color: #6b7280;">${user.nombreCompleto || 'No especificado'}</span>
                                </div>
                                ${user.nombre ? `
                                <div style="margin-bottom: 12px;">
                                    <label style="font-weight: bold; color: #374151; display: block; margin-bottom: 4px;">Nombre:</label>
                                    <span style="color: #6b7280;">${user.nombre}</span>
                                </div>
                                ` : ''}
                                ${user.apellidoPaterno ? `
                                <div style="margin-bottom: 12px;">
                                    <label style="font-weight: bold; color: #374151; display: block; margin-bottom: 4px;">Apellido Paterno:</label>
                                    <span style="color: #6b7280;">${user.apellidoPaterno}</span>
                                </div>
                                ` : ''}
                                ${user.apellidoMaterno ? `
                                <div style="margin-bottom: 12px;">
                                    <label style="font-weight: bold; color: #374151; display: block; margin-bottom: 4px;">Apellido Materno:</label>
                                    <span style="color: #6b7280;">${user.apellidoMaterno}</span>
                                </div>
                                ` : ''}
                                ${user.rut ? `
                                <div style="margin-bottom: 12px;">
                                    <label style="font-weight: bold; color: #374151; display: block; margin-bottom: 4px;">RUT:</label>
                                    <span style="color: #6b7280;">${user.rut}</span>
                                </div>
                                ` : ''}
                                ${user.telefono ? `
                                <div style="margin-bottom: 12px;">
                                    <label style="font-weight: bold; color: #374151; display: block; margin-bottom: 4px;">Teléfono:</label>
                                    <span style="color: #6b7280;">${user.telefono}</span>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Sección: Información de Acceso -->
                        <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <h4 style="color: #10b981; margin: 0 0 20px 0; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.5rem;">🔐</span> Información de Acceso
                            </h4>
                            <div style="space-y: 12px;">
                                <div style="margin-bottom: 12px;">
                                    <label style="font-weight: bold; color: #374151; display: block; margin-bottom: 4px;">Usuario:</label>
                                    <code style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-weight: bold; color: #1e40af;">${user.username}</code>
                                </div>
                                <div style="margin-bottom: 12px;">
                                    <label style="font-weight: bold; color: #374151; display: block; margin-bottom: 4px;">Email:</label>
                                    <span style="color: #3b82f6; font-weight: 500;">${user.email}</span>
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <label style="font-weight: bold; color: #374151; display: block; margin-bottom: 8px;">🔑 Contraseña:</label>
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <span id="password_${user.username}" style="
                                            font-family: 'Courier New', monospace;
                                            background: #f8f9fa;
                                            padding: 10px 15px;
                                            border-radius: 8px;
                                            border: 2px solid #dee2e6;
                                            flex: 1;
                                            font-weight: bold;
                                            letter-spacing: 1px;
                                            transition: all 0.3s ease;
                                        ">••••••••</span>
                                        <button onclick="authorizedProfilesManager.togglePassword('${user.username}', '${user.password || 'No disponible'}')" style="
                                            background: #3b82f6;
                                            color: white;
                                            border: none;
                                            padding: 10px 15px;
                                            border-radius: 8px;
                                            cursor: pointer;
                                            font-size: 0.9rem;
                                            font-weight: bold;
                                            transition: all 0.3s ease;
                                            min-width: 100px;
                                        " id="toggleBtn_${user.username}">👁️ Mostrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sección: Información Profesional -->
                    <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 25px;">
                        <h4 style="color: #f59e0b; margin: 0 0 20px 0; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.5rem;">🏢</span> Información Profesional
                        </h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <label style="font-weight: bold; color: #374151; display: block; margin-bottom: 4px;">Establecimiento:</label>
                                <span style="color: #6b7280;">${user.establecimiento || 'No especificado'}</span>
                            </div>
                            <div>
                                <label style="font-weight: bold; color: #374151; display: block; margin-bottom: 4px;">Cargo:</label>
                                <span style="color: #6b7280;">${user.cargo || 'No especificado'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sección: Historial de Estados -->
                    <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 25px;">
                        <h4 style="color: #8b5cf6; margin: 0 0 20px 0; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.5rem;">📋</span> Historial de Estados
                        </h4>
                        <div style="space-y: 12px;">
                            <div style="margin-bottom: 12px;">
                                <label style="font-weight: bold; color: #374151; display: block; margin-bottom: 4px;">📅 Fecha de Registro:</label>
                                <span style="color: #6b7280;">${formatDate(user.registrationDate)}</span>
                            </div>
                            ${user.fechaAprobacion ? `
                            <div style="margin-bottom: 12px;">
                                <label style="font-weight: bold; color: #059669; display: block; margin-bottom: 4px;">✅ Fecha de Aprobación:</label>
                                <span style="color: #059669;">${formatDate(user.fechaAprobacion)}</span>
                                ${user.aprobadoPor ? `<br><small style="color: #6b7280;">Aprobado por: ${user.aprobadoPor}</small>` : ''}
                            </div>
                            ` : ''}
                            ${user.fechaRechazo ? `
                            <div style="margin-bottom: 12px;">
                                <label style="font-weight: bold; color: #dc2626; display: block; margin-bottom: 4px;">❌ Fecha de Rechazo:</label>
                                <span style="color: #dc2626;">${formatDate(user.fechaRechazo)}</span>
                                ${user.rechazadoPor ? `<br><small style="color: #6b7280;">Rechazado por: ${user.rechazadoPor}</small>` : ''}
                                ${user.motivoRechazo ? `<br><small style="color: #dc2626;">Motivo: ${user.motivoRechazo}</small>` : ''}
                            </div>
                            ` : ''}
                            ${user.fechaPromocion ? `
                            <div style="margin-bottom: 12px;">
                                <label style="font-weight: bold; color: #7c3aed; display: block; margin-bottom: 4px;">👑 Fecha de Promoción:</label>
                                <span style="color: #7c3aed;">${formatDate(user.fechaPromocion)}</span>
                                ${user.promocionadoPor ? `<br><small style="color: #6b7280;">Promovido por: ${user.promocionadoPor}</small>` : ''}
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Botones de Acción -->
                    <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-top: 30px;">
                        <button onclick="authorizedProfilesManager.copyUserInfo('${user.username}')" style="
                            background: #17a2b8;
                            color: white;
                            border: none;
                            padding: 12px 25px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 1rem;
                            transition: all 0.3s ease;
                        ">📋 Copiar Información</button>
                        
                        ${user.status === 'pendiente' ? `
                            <button onclick="authorizedProfilesManager.quickApproveUser('${user.username}')" style="
                                background: #28a745;
                                color: white;
                                border: none;
                                padding: 12px 25px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                                font-size: 1rem;
                                transition: all 0.3s ease;
                            ">✅ Aprobar Usuario</button>
                            <button onclick="authorizedProfilesManager.quickRejectUser('${user.username}')" style="
                                background: #dc3545;
                                color: white;
                                border: none;
                                padding: 12px 25px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                                font-size: 1rem;
                                transition: all 0.3s ease;
                            ">❌ Rechazar</button>
                        ` : ''}
                        
                        ${user.status === 'aprobada' ? `
                            <button onclick="authorizedProfilesManager.quickPromoteUser('${user.username}')" style="
                                background: #ffc107;
                                color: #212529;
                                border: none;
                                padding: 12px 25px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                                font-size: 1rem;
                                transition: all 0.3s ease;
                            ">👑 Promover a Admin</button>
                        ` : ''}
                        
                        ${user.status === 'rechazada' ? `
                            <button onclick="authorizedProfilesManager.quickApproveUser('${user.username}')" style="
                                background: #28a745;
                                color: white;
                                border: none;
                                padding: 12px 25px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                                font-size: 1rem;
                                transition: all 0.3s ease;
                            ">✅ Revisar y Aprobar</button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('selectedUserDetails').innerHTML = detailsHTML;
    }
    
    // Alternar visibilidad de contraseña
    togglePassword(username, password) {
        const passwordSpan = document.getElementById(`password_${username}`);
        const toggleBtn = document.getElementById(`toggleBtn_${username}`);
        
        if (!passwordSpan || !toggleBtn) return;
        
        if (passwordSpan.textContent === '••••••••') {
            passwordSpan.textContent = password;
            toggleBtn.innerHTML = '🙈 Ocultar';
            toggleBtn.style.background = '#ef4444';
        } else {
            passwordSpan.textContent = '••••••••';
            toggleBtn.innerHTML = '👁️ Mostrar';
            toggleBtn.style.background = '#3b82f6';
        }
    }
    
    // Copiar información del usuario (versión completa)
    copyUserInfo(username) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username);
        
        if (!user) return;
        
        const info = `INFORMACIÓN CONFIDENCIAL COMPLETA DEL USUARIO
${'='.repeat(60)}

👤 DATOS PERSONALES:
   • Nombre Completo: ${user.nombreCompleto || 'No especificado'}
   • Nombre: ${user.nombre || 'No especificado'}
   • Apellido Paterno: ${user.apellidoPaterno || 'No especificado'}
   • Apellido Materno: ${user.apellidoMaterno || 'No especificado'}
   • RUT: ${user.rut || 'No especificado'}
   • Teléfono: ${user.telefono || 'No especificado'}

� INFORMACIÓN DE ACCESO:
   • Usuario: ${user.username}
   • Email: ${user.email}
   • Contraseña: ${user.password || 'No disponible'}
   • Estado: ${user.status}

🏢 INFORMACIÓN PROFESIONAL:
   • Establecimiento: ${user.establecimiento || 'No especificado'}
   • Cargo: ${user.cargo || 'No especificado'}

� HISTORIAL:
   • Fecha de Registro: ${user.registrationDate ? new Date(user.registrationDate).toLocaleString('es-CL') : 'No disponible'}${user.fechaAprobacion ? `
   • Fecha de Aprobación: ${new Date(user.fechaAprobacion).toLocaleString('es-CL')}
   • Aprobado por: ${user.aprobadoPor || 'No especificado'}` : ''}${user.fechaRechazo ? `
   • Fecha de Rechazo: ${new Date(user.fechaRechazo).toLocaleString('es-CL')}
   • Rechazado por: ${user.rechazadoPor || 'No especificado'}
   • Motivo de Rechazo: ${user.motivoRechazo || 'No especificado'}` : ''}${user.fechaPromocion ? `
   • Fecha de Promoción: ${new Date(user.fechaPromocion).toLocaleString('es-CL')}
   • Promovido por: ${user.promocionadoPor || 'No especificado'}` : ''}

${'='.repeat(60)}
Generado por: Francisco Ramos (Super Admin)
Sistema: SLEP Iquique - Perfiles Autorizados
Fecha de Generación: ${new Date().toLocaleString('es-CL')}
${'='.repeat(60)}`;
        
        navigator.clipboard.writeText(info).then(() => {
            alert('📋 Información completa copiada al portapapeles exitosamente');
        }).catch(() => {
            // Fallback si clipboard no funciona
            prompt('📋 Copia esta información completa:', info);
        });
    }
    
    // Rechazar usuario rápidamente
    quickRejectUser(username) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
            const motivo = prompt(`¿Por qué rechazar la cuenta de "${users[userIndex].nombreCompleto}"?\n\nEscribe el motivo del rechazo:`);
            
            if (motivo !== null && motivo.trim() !== '') {
                users[userIndex].status = 'rechazada';
                users[userIndex].fechaRechazo = new Date().toISOString();
                users[userIndex].rechazadoPor = 'Francisco Ramos';
                users[userIndex].motivoRechazo = motivo.trim();
                
                this.saveUsers(users);
                alert(`❌ Usuario ${users[userIndex].nombreCompleto} rechazado exitosamente\n\nMotivo: ${motivo}`);
                this.showSelectedUserDetails(username); // Actualizar vista
            }
        }
    }
    
    // Mostrar todos los usuarios (versión mejorada)
    showAllUsersDetails() {
        const users = this.getUsers().filter(u => u.status !== 'admin' && u.status !== 'super_admin');
        
        if (users.length === 0) {
            document.getElementById('selectedUserDetails').innerHTML = `
                <div style="text-align: center; color: #6c757d; padding: 40px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">👥</div>
                    <h3>No hay usuarios registrados</h3>
                    <p>Aún no se han registrado usuarios en el sistema.</p>
                </div>
            `;
            return;
        }
        
        // Función helper para obtener color del estado
        const getStatusBadge = (status) => {
            const statusConfig = {
                'pendiente': { bg: '#fef3c7', color: '#92400e', icon: '⏳', text: 'Pendiente' },
                'aprobada': { bg: '#d1fae5', color: '#065f46', icon: '✅', text: 'Aprobado' },
                'rechazada': { bg: '#fee2e2', color: '#991b1b', icon: '❌', text: 'Rechazado' },
                'admin': { bg: '#dbeafe', color: '#1e40af', icon: '👑', text: 'Admin' }
            };
            const config = statusConfig[status] || { bg: '#f3f4f6', color: '#374151', icon: '❓', text: status };
            return `<span style="
                background: ${config.bg};
                color: ${config.color};
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                gap: 4px;
            ">${config.icon} ${config.text}</span>`;
        };
        
        // Estadísticas rápidas
        const estadisticas = {
            total: users.length,
            pendientes: users.filter(u => u.status === 'pendiente').length,
            aprobados: users.filter(u => u.status === 'aprobada').length,
            rechazados: users.filter(u => u.status === 'rechazada').length
        };
        
        let allUsersHTML = `
            <div style="width: 100%;">
                <!-- Header con estadísticas -->
                <div style="text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 15px;">
                    <h2 style="margin: 0 0 15px 0; font-size: 2rem;">📊 Resumen Completo de Usuarios</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-top: 20px;">
                        <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                            <div style="font-size: 2rem; font-weight: bold;">${estadisticas.total}</div>
                            <div style="font-size: 0.9rem; opacity: 0.9;">Total</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                            <div style="font-size: 2rem; font-weight: bold;">${estadisticas.pendientes}</div>
                            <div style="font-size: 0.9rem; opacity: 0.9;">⏳ Pendientes</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                            <div style="font-size: 2rem; font-weight: bold;">${estadisticas.aprobados}</div>
                            <div style="font-size: 0.9rem; opacity: 0.9;">✅ Aprobados</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                            <div style="font-size: 2rem; font-weight: bold;">${estadisticas.rechazados}</div>
                            <div style="font-size: 0.9rem; opacity: 0.9;">❌ Rechazados</div>
                        </div>
                    </div>
                </div>
                
                <!-- Lista de usuarios -->
                <div style="max-height: 500px; overflow-y: auto; border: 2px solid #e5e7eb; border-radius: 12px; background: white;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead style="background: #f8f9fa; position: sticky; top: 0; z-index: 10;">
                            <tr>
                                <th style="padding: 15px; text-align: left; font-weight: bold; color: #374151; border-bottom: 2px solid #e5e7eb;">#</th>
                                <th style="padding: 15px; text-align: left; font-weight: bold; color: #374151; border-bottom: 2px solid #e5e7eb;">👤 Usuario</th>
                                <th style="padding: 15px; text-align: left; font-weight: bold; color: #374151; border-bottom: 2px solid #e5e7eb;">📧 Email</th>
                                <th style="padding: 15px; text-align: left; font-weight: bold; color: #374151; border-bottom: 2px solid #e5e7eb;">🔑 Contraseña</th>
                                <th style="padding: 15px; text-align: left; font-weight: bold; color: #374151; border-bottom: 2px solid #e5e7eb;">📊 Estado</th>
                                <th style="padding: 15px; text-align: left; font-weight: bold; color: #374151; border-bottom: 2px solid #e5e7eb;">🏢 Establecimiento</th>
                                <th style="padding: 15px; text-align: center; font-weight: bold; color: #374151; border-bottom: 2px solid #e5e7eb;">⚙️ Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        users.forEach((user, index) => {
            const isEven = index % 2 === 0;
            allUsersHTML += `
                <tr style="background: ${isEven ? '#fafafa' : 'white'}; transition: background-color 0.2s ease;" 
                    onmouseover="this.style.background='#f0f9ff'" 
                    onmouseout="this.style.background='${isEven ? '#fafafa' : 'white'}'">
                    
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280;">
                        ${index + 1}
                    </td>
                    
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                        <div style="display: flex; flex-direction: column;">
                            <strong style="color: #374151; font-size: 1rem;">${user.nombreCompleto || user.username}</strong>
                            <small style="color: #6b7280; margin-top: 2px;">
                                <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">${user.username}</code>
                            </small>
                            ${user.cargo ? `<small style="color: #3b82f6; margin-top: 2px;">👔 ${user.cargo}</small>` : ''}
                        </div>
                    </td>
                    
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                        <div style="color: #3b82f6; font-weight: 500; word-break: break-all;">
                            ${user.email}
                        </div>
                        ${user.telefono ? `<small style="color: #6b7280; display: block; margin-top: 4px;">📱 ${user.telefono}</small>` : ''}
                    </td>
                    
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span id="passwordTableDisplay_${user.username}" style="
                                font-family: 'Courier New', monospace;
                                background: #f8f9fa;
                                padding: 6px 10px;
                                border-radius: 6px;
                                border: 1px solid #e5e7eb;
                                font-weight: bold;
                                color: #374151;
                                min-width: 80px;
                                display: inline-block;
                            ">••••••••</span>
                            <button onclick="authorizedProfilesManager.toggleTablePassword('${user.username}', '${user.password || 'N/A'}')" style="
                                background: #3b82f6;
                                color: white;
                                border: none;
                                padding: 4px 8px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 0.7rem;
                                min-width: 60px;
                            " id="toggleTableBtn_${user.username}">👁️</button>
                        </div>
                    </td>
                    
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                        ${getStatusBadge(user.status)}
                        ${user.registrationDate ? `
                            <small style="display: block; color: #6b7280; margin-top: 6px;">
                                📅 ${new Date(user.registrationDate).toLocaleDateString('es-CL')}
                            </small>
                        ` : ''}
                    </td>
                    
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                        <div style="color: #6b7280; font-size: 0.9rem;">
                            ${user.establecimiento || 'No especificado'}
                        </div>
                    </td>
                    
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center;">
                        <div style="display: flex; justify-content: center; gap: 6px;">
                            <button onclick="authorizedProfilesManager.showSelectedUserDetails('${user.username}')" style="
                                background: #3b82f6;
                                color: white;
                                border: none;
                                padding: 6px 12px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 0.8rem;
                                font-weight: bold;
                            " title="Ver detalles completos">👁️</button>
                            
                            <button onclick="authorizedProfilesManager.copyUserInfo('${user.username}')" style="
                                background: #10b981;
                                color: white;
                                border: none;
                                padding: 6px 12px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 0.8rem;
                                font-weight: bold;
                            " title="Copiar información">📋</button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        allUsersHTML += `
                        </tbody>
                    </table>
                </div>
                
                <!-- Botones de acción masiva -->
                <div style="text-align: center; margin-top: 25px; background: #f8f9fa; padding: 20px; border-radius: 12px;">
                    <h4 style="margin: 0 0 15px 0; color: #374151;">⚙️ Acciones Masivas</h4>
                    <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                        <button onclick="authorizedProfilesManager.copyAllUsersInfo()" style="
                            background: #28a745;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            font-weight: bold;
                            cursor: pointer;
                            font-size: 1rem;
                        ">📋 Copiar Todos los Datos</button>
                        
                        <button onclick="authorizedProfilesManager.exportUsersToCSV()" style="
                            background: #17a2b8;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            font-weight: bold;
                            cursor: pointer;
                            font-size: 1rem;
                        ">📊 Exportar a CSV</button>
                        
                        <button onclick="authorizedProfilesManager.toggleAllPasswords()" style="
                            background: #ffc107;
                            color: #212529;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            font-weight: bold;
                            cursor: pointer;
                            font-size: 1rem;
                        " id="toggleAllPasswordsBtn">👁️ Mostrar Todas las Contraseñas</button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('selectedUserDetails').innerHTML = allUsersHTML;
    }
    
    // Alternar contraseña en la tabla
    toggleTablePassword(username, password) {
        const passwordSpan = document.getElementById(`passwordTableDisplay_${username}`);
        const toggleBtn = document.getElementById(`toggleTableBtn_${username}`);
        
        if (!passwordSpan || !toggleBtn) return;
        
        if (passwordSpan.textContent === '••••••••') {
            passwordSpan.textContent = password;
            passwordSpan.style.background = '#fef3c7';
            passwordSpan.style.color = '#92400e';
            toggleBtn.innerHTML = '🙈';
            toggleBtn.style.background = '#ef4444';
        } else {
            passwordSpan.textContent = '••••••••';
            passwordSpan.style.background = '#f8f9fa';
            passwordSpan.style.color = '#374151';
            toggleBtn.innerHTML = '👁️';
            toggleBtn.style.background = '#3b82f6';
        }
    }
    
    // Alternar todas las contraseñas
    toggleAllPasswords() {
        const users = this.getUsers().filter(u => u.status !== 'admin' && u.status !== 'super_admin');
        const toggleAllBtn = document.getElementById('toggleAllPasswordsBtn');
        const isShowingAll = toggleAllBtn.textContent.includes('Ocultar');
        
        users.forEach(user => {
            const passwordSpan = document.getElementById(`passwordTableDisplay_${user.username}`);
            const toggleBtn = document.getElementById(`toggleTableBtn_${user.username}`);
            
            if (passwordSpan && toggleBtn) {
                if (isShowingAll) {
                    // Ocultar todas
                    passwordSpan.textContent = '••••••••';
                    passwordSpan.style.background = '#f8f9fa';
                    passwordSpan.style.color = '#374151';
                    toggleBtn.innerHTML = '👁️';
                    toggleBtn.style.background = '#3b82f6';
                } else {
                    // Mostrar todas
                    passwordSpan.textContent = user.password || 'N/A';
                    passwordSpan.style.background = '#fef3c7';
                    passwordSpan.style.color = '#92400e';
                    toggleBtn.innerHTML = '🙈';
                    toggleBtn.style.background = '#ef4444';
                }
            }
        });
        
        // Cambiar texto del botón principal
        if (isShowingAll) {
            toggleAllBtn.innerHTML = '👁️ Mostrar Todas las Contraseñas';
        } else {
            toggleAllBtn.innerHTML = '🙈 Ocultar Todas las Contraseñas';
        }
    }
    
    // Exportar usuarios a CSV
    exportUsersToCSV() {
        const users = this.getUsers().filter(u => u.status !== 'admin' && u.status !== 'super_admin');
        
        if (users.length === 0) {
            alert('❌ No hay usuarios para exportar');
            return;
        }
        
        // Crear CSV
        const headers = [
            'Nombre Completo', 'Usuario', 'Email', 'Contraseña', 'Estado', 
            'Establecimiento', 'Cargo', 'Teléfono', 'RUT', 'Fecha Registro'
        ];
        
        let csvContent = headers.join(',') + '\n';
        
        users.forEach(user => {
            const row = [
                `"${user.nombreCompleto || ''}"`,
                `"${user.username || ''}"`,
                `"${user.email || ''}"`,
                `"${user.password || ''}"`,
                `"${user.status || ''}"`,
                `"${user.establecimiento || ''}"`,
                `"${user.cargo || ''}"`,
                `"${user.telefono || ''}"`,
                `"${user.rut || ''}"`,
                `"${user.registrationDate ? new Date(user.registrationDate).toLocaleDateString('es-CL') : ''}"`
            ];
            csvContent += row.join(',') + '\n';
        });
        
        // Descargar archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `usuarios_slep_iquique_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`✅ Archivo CSV exportado exitosamente\n\n📊 ${users.length} usuarios exportados\n📅 Fecha: ${new Date().toLocaleDateString('es-CL')}`);
    }
    
    // Copiar información de todos los usuarios
    copyAllUsersInfo() {
        const users = this.getUsers().filter(u => u.status !== 'admin' && u.status !== 'super_admin');
        
        let allInfo = `LISTADO COMPLETO DE USUARIOS - SLEP IQUIQUE
Generado por: Francisco Ramos (Super Admin)
Fecha: ${new Date().toLocaleString('es-CL')}
Total de usuarios: ${users.length}

${'='.repeat(60)}

`;
        
        users.forEach((user, index) => {
            allInfo += `${index + 1}. ${user.nombreCompleto || user.username}
   👤 Usuario: ${user.username}
   📧 Email: ${user.email}
   🔑 Contraseña: ${user.password || 'No disponible'}
   📊 Estado: ${user.status}
   🏢 Establecimiento: ${user.establecimiento || 'No especificado'}
   👔 Cargo: ${user.cargo || 'No especificado'}
   📅 Registro: ${user.registrationDate ? new Date(user.registrationDate).toLocaleString('es-CL') : 'No disponible'}

`;
        });
        
        navigator.clipboard.writeText(allInfo).then(() => {
            alert('📋 Información de todos los usuarios copiada al portapapeles exitosamente');
        }).catch(() => {
            prompt('📋 Copia esta información:', allInfo);
        });
    }
    
    // Acciones rápidas
    quickApproveUser(username) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
            users[userIndex].status = 'aprobada';
            users[userIndex].fechaAprobacion = new Date().toISOString();
            users[userIndex].aprobadoPor = 'Francisco Ramos';
            
            this.saveUsers(users);
            alert(`✅ Usuario ${users[userIndex].nombreCompleto} aprobado exitosamente`);
            this.showSelectedUserDetails(username); // Actualizar vista
        }
    }
    
    quickPromoteUser(username) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
            if (confirm(`¿Promover a ${users[userIndex].nombreCompleto} a Administrador?`)) {
                users[userIndex].status = 'admin';
                users[userIndex].role = 'admin';
                users[userIndex].fechaPromocion = new Date().toISOString();
                users[userIndex].promocionadoPor = 'Francisco Ramos';
                
                this.saveUsers(users);
                alert(`👑 ${users[userIndex].nombreCompleto} promovido a Administrador exitosamente`);
                this.showSelectedUserDetails(username); // Actualizar vista
            }
        }
    }
    
    // Debug Sistema de Usuarios
    debugUserSystem() {
        this.showTestResults('🔧 Debug Sistema de Usuarios', 'Analizando sistema...');
        
        try {
            const users = this.getUsers();
            
            const stats = {
                total: users.length,
                pendientes: users.filter(u => u.status === 'pendiente').length,
                aprobados: users.filter(u => u.status === 'aprobada').length,
                admins: users.filter(u => u.status === 'admin').length,
                rechazados: users.filter(u => u.status === 'rechazada').length
            };
            
            let debugInfo = `📊 ESTADÍSTICAS DEL SISTEMA\n`;
            debugInfo += `• Total usuarios: ${stats.total}\n`;
            debugInfo += `• Pendientes: ${stats.pendientes}\n`;
            debugInfo += `• Aprobados: ${stats.aprobados}\n`;
            debugInfo += `• Administradores: ${stats.admins}\n`;
            debugInfo += `• Rechazados: ${stats.rechazados}\n\n`;
            
            debugInfo += `🔍 VERIFICACIONES\n`;
            debugInfo += `• LocalStorage funcionando: ${localStorage ? '✅' : '❌'}\n`;
            debugInfo += `• Datos guardados: ${localStorage.getItem('appUsers') ? '✅' : '❌'}\n`;
            debugInfo += `• Usuario actual: ${this.currentUser ? '✅' : '❌'}\n`;
            debugInfo += `• Permisos Francisco: ${this.isFranciscoSuperAdmin() ? '✅' : '❌'}\n`;
            
            this.updateTestResults(debugInfo);
            
        } catch (error) {
            this.updateTestResults(`❌ Error en debug: ${error.message}`);
        }
    }
    
    // Test Autenticación
    testAuthentication() {
        this.showTestResults('🔐 Test Autenticación', 'Verificando permisos...');
        
        try {
            let authInfo = `🔐 INFORMACIÓN DE AUTENTICACIÓN\n\n`;
            
            const currentUser = this.getCurrentUser();
            if (currentUser) {
                authInfo += `👤 Usuario actual:\n`;
                authInfo += `  • Username: ${currentUser.username}\n`;
                authInfo += `  • Email: ${currentUser.email}\n`;
                authInfo += `  • Status: ${currentUser.status}\n`;
                authInfo += `  • Es Francisco: ${this.isFranciscoSuperAdmin() ? '✅ SÍ' : '❌ NO'}\n\n`;
            } else {
                authInfo += `❌ No hay usuario logueado\n\n`;
            }
            
            authInfo += `🔑 VERIFICACIONES DE PERMISOS:\n`;
            authInfo += `• Super Admin: ${this.isFranciscoSuperAdmin() ? '✅' : '❌'}\n`;
            authInfo += `• Email Francisco: ${currentUser?.email === 'francisco.ramos@slepiquique.cl' ? '✅' : '❌'}\n`;
            authInfo += `• Status Super Admin: ${currentUser?.status === 'super_admin' ? '✅' : '❌'}\n`;
            
            this.updateTestResults(authInfo);
            
        } catch (error) {
            this.updateTestResults(`❌ Error en test auth: ${error.message}`);
        }
    }
    
    // Tests Avanzados
    runAdvancedTests() {
        this.showTestResults('⚡ Tests Avanzados', 'Ejecutando batería de tests...');
        
        try {
            let results = `⚡ BATERÍA DE TESTS AVANZADOS\n\n`;
            
            // Test 1: Verificar localStorage
            try {
                localStorage.setItem('test', 'value');
                localStorage.removeItem('test');
                results += `✅ Test 1: LocalStorage funcionando\n`;
            } catch (e) {
                results += `❌ Test 1: Error en localStorage\n`;
            }
            
            // Test 2: Verificar JSON
            try {
                const testObj = { test: true };
                JSON.stringify(testObj);
                JSON.parse('{"test":true}');
                results += `✅ Test 2: JSON funcionando\n`;
            } catch (e) {
                results += `❌ Test 2: Error en JSON\n`;
            }
            
            // Test 3: Verificar usuarios
            try {
                const users = this.getUsers();
                if (Array.isArray(users)) {
                    results += `✅ Test 3: Sistema de usuarios OK (${users.length} usuarios)\n`;
                } else {
                    results += `❌ Test 3: Sistema de usuarios corrupto\n`;
                }
            } catch (e) {
                results += `❌ Test 3: Error accediendo usuarios\n`;
            }
            
            // Test 4: Verificar DOM
            try {
                const container = document.getElementById('authorized-profiles-container');
                if (container) {
                    results += `✅ Test 4: DOM accesible\n`;
                } else {
                    results += `❌ Test 4: Error accediendo DOM\n`;
                }
            } catch (e) {
                results += `❌ Test 4: Error en DOM\n`;
            }
            
            results += `\n🎯 Tests completados - Revisa los resultados`;
            this.updateTestResults(results);
            
        } catch (error) {
            this.updateTestResults(`❌ Error en tests avanzados: ${error.message}`);
        }
    }
    
    // Mostrar resultados de tests
    showTestResults(title, initialMessage) {
        const resultsDiv = document.getElementById('test-results');
        const outputDiv = document.getElementById('test-output');
        
        if (resultsDiv && outputDiv) {
            resultsDiv.style.display = 'block';
            outputDiv.innerHTML = `<h5>${title}</h5><pre style="white-space: pre-wrap; background: #fff; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">${initialMessage}</pre>`;
            
            // Scroll hasta los resultados
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Actualizar resultados de tests
    updateTestResults(message) {
        const outputDiv = document.getElementById('test-output');
        if (outputDiv) {
            const pre = outputDiv.querySelector('pre');
            if (pre) {
                pre.textContent += '\n' + message;
            }
        }
    }
}

// Variable global para acceder desde el HTML
let authorizedProfilesManager;

// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    authorizedProfilesManager = new AuthorizedProfilesManager();
});
