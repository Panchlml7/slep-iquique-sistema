// Sistema de Gestión de Documentos - SLEP Iquique
// Almacenamiento y gestión usando localStorage

class DocumentManager {
    constructor() {
        this.storageKey = 'slep_documentos';
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStatistics();
        this.loadDocuments();
        this.updateUserInfo();
    }

    // Configurar event listeners
    setupEventListeners() {
        // Formulario de datos básicos
        const uploadForm = document.getElementById('uploadForm');
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => this.handleBasicDataSubmit(e));
        }

        // Formulario de desarrollo de visita
        const visitaForm = document.getElementById('visitaForm');
        if (visitaForm) {
            visitaForm.addEventListener('submit', (e) => this.handleVisitaSubmit(e));
        }

        // Filtros por equipo
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.filterDocuments(btn.dataset.team));
        });

        // Upload de archivos
        this.setupFileUpload();

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    // Configurar área de upload de archivos
    setupFileUpload() {
        const fileUploadArea = document.getElementById('fileUploadArea2');
        const fileInput = document.getElementById('fileInput2');

        if (fileUploadArea && fileInput) {
            fileUploadArea.addEventListener('click', () => fileInput.click());
            
            fileUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUploadArea.classList.add('dragover');
            });

            fileUploadArea.addEventListener('dragleave', () => {
                fileUploadArea.classList.remove('dragover');
            });

            fileUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUploadArea.classList.remove('dragover');
                this.handleFiles(e.dataTransfer.files);
            });

            fileInput.addEventListener('change', (e) => {
                this.handleFiles(e.target.files);
            });
        }
    }

    // Manejar archivos subidos
    async handleFiles(files) {
        const fileList = Array.from(files);
        for (const file of fileList) {
            if (file.size > 5 * 1024 * 1024) { // 5MB límite
                this.showMessage(`El archivo ${file.name} es muy grande (máximo 5MB)`, 'error');
                continue;
            }
            
            await this.processFile(file);
        }
        this.showMessage(`${fileList.length} archivo(s) procesado(s) correctamente`, 'success');
    }

    // Procesar archivo individual
    processFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileData = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: e.target.result,
                    uploadDate: new Date().toISOString()
                };
                
                // Guardar en sessionStorage temporalmente hasta que se complete el formulario
                let tempFiles = JSON.parse(sessionStorage.getItem('tempFiles') || '[]');
                tempFiles.push(fileData);
                sessionStorage.setItem('tempFiles', JSON.stringify(tempFiles));
                
                resolve(fileData);
            };
            reader.readAsDataURL(file);
        });
    }

    // Manejar envío de datos básicos
    handleBasicDataSubmit(e) {
        e.preventDefault();
        
        if (!this.validateBasicForm()) {
            return;
        }

        const basicData = this.getBasicFormData();
        
        // Guardar datos básicos temporalmente
        sessionStorage.setItem('tempBasicData', JSON.stringify(basicData));
        
        this.showMessage('Datos básicos guardados. Continúa con el desarrollo de la visita.', 'success');
        
        // Cambiar a la pestaña de desarrollo
        this.switchTab('desarrollo-visita');
    }

    // Manejar envío completo del documento
    handleVisitaSubmit(e) {
        e.preventDefault();
        
        if (!this.validateVisitaForm()) {
            return;
        }

        const visitaData = this.getVisitaFormData();
        const basicData = JSON.parse(sessionStorage.getItem('tempBasicData') || '{}');
        const files = JSON.parse(sessionStorage.getItem('tempFiles') || '[]');

        // Combinar todos los datos
        const completeDocument = {
            id: this.generateId(),
            ...basicData,
            ...visitaData,
            files: files,
            createdBy: this.currentUser.username,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Guardar documento completo
        this.saveDocument(completeDocument);
        
        // Limpiar datos temporales
        sessionStorage.removeItem('tempBasicData');
        sessionStorage.removeItem('tempFiles');
        
        // Limpiar formularios
        this.clearForms();
        
        this.showMessage('Documento registrado exitosamente', 'success');
        
        // Actualizar estadísticas y mostrar documentos
        this.loadStatistics();
        this.switchTab('documentos-guardados');
        this.loadDocuments();
    }

    // Obtener datos del formulario básico
    getBasicFormData() {
        return {
            numActa: document.getElementById('numActa').value,
            equipo: document.getElementById('teamSelect').value,
            objetivoEstrategico: document.getElementById('objetivoEstrategico').value,
            asesor1: document.getElementById('asesor1').value,
            asesor2: document.getElementById('asesor2').value,
            nombreEstablecimiento: document.getElementById('nombreEstablecimiento').value,
            rbd: document.getElementById('rbd').value,
            fechaVisita: document.getElementById('fechaVisita').value,
            horaInicio: document.getElementById('horaInicio').value,
            horaTermino: document.getElementById('horaTermino').value,
            modalidad: document.getElementById('modalidad').value,
            cicloApoyo: document.getElementById('cicloApoyo').value,
            capacidadBasal: document.getElementById('capacidadBasal').value,
            nivelImplementacion: document.getElementById('nivelImplementacion').value,
            rolProfesional: document.getElementById('rolProfesional').value
        };
    }

    // Obtener datos del formulario de visita
    getVisitaFormData() {
        return {
            objetivoVisita: document.getElementById('objetivoVisita').value,
            antecedentes: document.getElementById('antecedentes').value,
            instrumentos: document.getElementById('instrumentos').value,
            practicaProblematica: document.getElementById('practicaProblematica').value,
            actividadesRealizadas: document.getElementById('actividadesRealizadas').value,
            acuerdos: document.getElementById('acuerdos').value,
            aspectosPositivos: document.getElementById('aspectosPositivos').value,
            areasMejora: document.getElementById('areasMejora').value,
            docTitle2: document.getElementById('docTitle2').value,
            docDescription2: document.getElementById('docDescription2').value
        };
    }

    // Validar formulario básico
    validateBasicForm() {
        const requiredFields = [
            'numActa', 'teamSelect', 'objetivoEstrategico', 'asesor1',
            'nombreEstablecimiento', 'rbd', 'fechaVisita', 'horaInicio',
            'horaTermino', 'modalidad', 'cicloApoyo', 'capacidadBasal',
            'nivelImplementacion', 'rolProfesional'
        ];

        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                this.showMessage(`El campo ${field.previousElementSibling.textContent} es obligatorio`, 'error');
                field.focus();
                return false;
            }
        }

        // Validar formato RBD
        const rbd = document.getElementById('rbd').value;
        if (!/^\d+-?\d*$/.test(rbd)) {
            this.showMessage('El formato del RBD no es válido', 'error');
            document.getElementById('rbd').focus();
            return false;
        }

        // Validar horarios
        const horaInicio = document.getElementById('horaInicio').value;
        const horaTermino = document.getElementById('horaTermino').value;
        if (horaInicio >= horaTermino) {
            this.showMessage('La hora de término debe ser posterior a la hora de inicio', 'error');
            return false;
        }

        return true;
    }

    // Validar formulario de visita
    validateVisitaForm() {
        const requiredFields = [
            'objetivoVisita', 'antecedentes', 'instrumentos', 'practicaProblematica',
            'actividadesRealizadas', 'acuerdos', 'aspectosPositivos', 'areasMejora'
        ];

        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                this.showMessage(`El campo ${field.previousElementSibling.textContent} es obligatorio`, 'error');
                field.focus();
                return false;
            }
        }

        return true;
    }

    // Guardar documento en localStorage
    saveDocument(document) {
        let documents = this.getDocuments();
        documents.push(document);
        localStorage.setItem(this.storageKey, JSON.stringify(documents));
    }

    // Obtener todos los documentos
    getDocuments() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    // Cargar y mostrar documentos
    loadDocuments(teamFilter = 'all') {
        const documents = this.getDocuments();
        const filteredDocs = teamFilter === 'all' 
            ? documents 
            : documents.filter(doc => doc.equipo === teamFilter);

        const grid = document.getElementById('documentsGrid');
        if (!grid) return;

        if (filteredDocs.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">
                    <h3>No hay documentos ${teamFilter !== 'all' ? 'para este equipo' : 'guardados'}</h3>
                    <p>Los documentos aparecerán aquí cuando sean registrados.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filteredDocs.map(doc => this.createDocumentCard(doc)).join('');
    }

    // Crear tarjeta de documento
    createDocumentCard(doc) {
        const createdDate = new Date(doc.createdAt).toLocaleString('es-ES');
        const fileCount = doc.files ? doc.files.length : 0;
        
        return `
            <div class="document-card" data-doc-id="${doc.id}">
                <div class="doc-header">
                    <div class="doc-type form">ACTA</div>
                    <small>${createdDate}</small>
                </div>
                
                <h4>${doc.numActa}</h4>
                <p><strong>Establecimiento:</strong> ${doc.nombreEstablecimiento}</p>
                <p><strong>RBD:</strong> ${doc.rbd}</p>
                <p><strong>Equipo:</strong> ${this.getTeamLabel(doc.equipo)}</p>
                <p><strong>Fecha Visita:</strong> ${new Date(doc.fechaVisita).toLocaleDateString('es-ES')}</p>
                <p><strong>Modalidad:</strong> ${doc.modalidad}</p>
                <p><strong>Asesor Principal:</strong> ${doc.asesor1}</p>
                <p><strong>Archivos:</strong> ${fileCount} archivo(s)</p>
                
                <div class="doc-actions">
                    <button class="btn-small btn-download" onclick="documentManager.viewDocument('${doc.id}')">
                        👁️ Ver Completo
                    </button>
                    <button class="btn-small btn-delete" onclick="documentManager.deleteDocument('${doc.id}')">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `;
    }

    // Ver documento completo
    viewDocument(docId) {
        const documents = this.getDocuments();
        const doc = documents.find(d => d.id === docId);
        
        if (!doc) {
            this.showMessage('Documento no encontrado', 'error');
            return;
        }

        // Crear modal para mostrar el documento completo
        const modal = this.createDocumentModal(doc);
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    // Crear modal para vista de documento
    createDocumentModal(doc) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 15px;
            max-width: 90%;
            max-height: 90%;
            overflow-y: auto;
            padding: 2rem;
            position: relative;
        `;

        modalContent.innerHTML = `
            <button onclick="this.closest('.modal-overlay').remove()" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: #e53e3e;
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
            ">×</button>
            
            <h2>📋 ${doc.numActa}</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div>
                    <h3>🏢 Información del Establecimiento</h3>
                    <p><strong>Nombre:</strong> ${doc.nombreEstablecimiento}</p>
                    <p><strong>RBD:</strong> ${doc.rbd}</p>
                    <p><strong>Equipo:</strong> ${this.getTeamLabel(doc.equipo)}</p>
                </div>
                
                <div>
                    <h3>📅 Detalles de la Visita</h3>
                    <p><strong>Fecha:</strong> ${new Date(doc.fechaVisita).toLocaleDateString('es-ES')}</p>
                    <p><strong>Horario:</strong> ${doc.horaInicio} - ${doc.horaTermino}</p>
                    <p><strong>Modalidad:</strong> ${doc.modalidad}</p>
                    <p><strong>Ciclo:</strong> ${doc.cicloApoyo}</p>
                </div>
                
                <div>
                    <h3>👥 Asesores</h3>
                    <p><strong>Asesor Principal:</strong> ${doc.asesor1}</p>
                    ${doc.asesor2 ? `<p><strong>Asesor Secundario:</strong> ${doc.asesor2}</p>` : ''}
                    <p><strong>Rol:</strong> ${doc.rolProfesional}</p>
                </div>
            </div>
            
            <div>
                <h3>🎯 Objetivo Estratégico</h3>
                <p>${doc.objetivoEstrategico}</p>
            </div>
            
            <div>
                <h3>💡 Capacidades</h3>
                <p><strong>Capacidad Basal:</strong> ${doc.capacidadBasal}</p>
                <p><strong>Nivel de Implementación:</strong> ${doc.nivelImplementacion}</p>
            </div>
            
            ${doc.objetivoVisita ? `
                <div>
                    <h3>🎯 Objetivo de la Visita</h3>
                    <p>${doc.objetivoVisita}</p>
                </div>
            ` : ''}
            
            ${doc.antecedentes ? `
                <div>
                    <h3>📋 Antecedentes</h3>
                    <p>${doc.antecedentes}</p>
                </div>
            ` : ''}
            
            ${doc.instrumentos ? `
                <div>
                    <h3>🔧 Instrumentos Utilizados</h3>
                    <p>${doc.instrumentos}</p>
                </div>
            ` : ''}
            
            ${doc.practicaProblematica ? `
                <div>
                    <h3>⚠️ Práctica Problemática</h3>
                    <p>${doc.practicaProblematica}</p>
                </div>
            ` : ''}
            
            ${doc.actividadesRealizadas ? `
                <div>
                    <h3>✅ Actividades Realizadas</h3>
                    <p>${doc.actividadesRealizadas}</p>
                </div>
            ` : ''}
            
            ${doc.acuerdos ? `
                <div>
                    <h3>🤝 Acuerdos</h3>
                    <p>${doc.acuerdos}</p>
                </div>
            ` : ''}
            
            ${doc.aspectosPositivos ? `
                <div>
                    <h3>✨ Aspectos Positivos</h3>
                    <p>${doc.aspectosPositivos}</p>
                </div>
            ` : ''}
            
            ${doc.areasMejora ? `
                <div>
                    <h3>📈 Áreas de Mejora</h3>
                    <p>${doc.areasMejora}</p>
                </div>
            ` : ''}
            
            ${doc.files && doc.files.length > 0 ? `
                <div>
                    <h3>📎 Archivos Adjuntos</h3>
                    ${doc.files.map(file => `
                        <div style="display: flex; align-items: center; gap: 1rem; margin: 0.5rem 0; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 5px;">
                            <span>📄</span>
                            <span>${file.name}</span>
                            <span style="color: #666; font-size: 0.8rem;">(${this.formatFileSize(file.size)})</span>
                            <button onclick="documentManager.downloadFile('${doc.id}', '${file.name}')" style="
                                background: #667eea;
                                color: white;
                                border: none;
                                padding: 0.3rem 0.8rem;
                                border-radius: 3px;
                                cursor: pointer;
                            ">Descargar</button>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div style="margin-top: 2rem; color: #666; font-size: 0.9rem;">
                <p><strong>Creado por:</strong> ${doc.createdBy}</p>
                <p><strong>Fecha de creación:</strong> ${new Date(doc.createdAt).toLocaleString('es-ES')}</p>
            </div>
        `;

        modal.appendChild(modalContent);
        return modal;
    }

    // Descargar archivo
    downloadFile(docId, fileName) {
        const documents = this.getDocuments();
        const doc = documents.find(d => d.id === docId);
        
        if (!doc) {
            this.showMessage('Documento no encontrado', 'error');
            return;
        }

        const file = doc.files.find(f => f.name === fileName);
        if (!file) {
            this.showMessage('Archivo no encontrado', 'error');
            return;
        }

        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Eliminar documento
    deleteDocument(docId) {
        if (!confirm('¿Estás seguro de que deseas eliminar este documento?')) {
            return;
        }

        let documents = this.getDocuments();
        documents = documents.filter(doc => doc.id !== docId);
        localStorage.setItem(this.storageKey, JSON.stringify(documents));
        
        this.showMessage('Documento eliminado correctamente', 'success');
        this.loadDocuments();
        this.loadStatistics();
    }

    // Filtrar documentos por equipo
    filterDocuments(team) {
        // Actualizar botones activos
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.team === team);
        });

        this.loadDocuments(team);
    }

    // Cargar estadísticas
    loadStatistics() {
        const documents = this.getDocuments();
        const today = new Date().toDateString();
        const recentUploads = documents.filter(doc => 
            new Date(doc.createdAt).toDateString() === today
        ).length;

        const teams = [...new Set(documents.map(doc => doc.equipo))];
        const totalSize = documents.reduce((sum, doc) => {
            return sum + (doc.files ? doc.files.reduce((fileSum, file) => fileSum + file.size, 0) : 0);
        }, 0);

        // Actualizar elementos de estadísticas
        this.updateStatElement('totalDocs', documents.length);
        this.updateStatElement('totalTeams', teams.length);
        this.updateStatElement('recentUploads', recentUploads);
        this.updateStatElement('totalSize', this.formatFileSize(totalSize));
    }

    // Actualizar elemento de estadística
    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Cambiar pestaña
    switchTab(tabName) {
        // Remover active de todos los botones y contenidos
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Activar el botón y contenido seleccionado
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }

    // Limpiar formularios
    clearForms() {
        document.getElementById('uploadForm').reset();
        document.getElementById('visitaForm').reset();
    }

    // Obtener etiqueta del equipo
    getTeamLabel(teamValue) {
        const teamLabels = {
            'directivos': 'Equipo Directivo',
            'administrativo': 'Administrativo',
            'docentes': 'Docentes',
            'mantenimiento': 'Mantenimiento',
            'coordinacion': 'Coordinación'
        };
        return teamLabels[teamValue] || teamValue;
    }

    // Formatear tamaño de archivo
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Actualizar información del usuario
    updateUserInfo() {
        const userInfoElement = document.getElementById('userInfo');
        if (userInfoElement && this.currentUser) {
            userInfoElement.textContent = `👤 ${this.currentUser.nombre}`;
        }
    }

    // Mostrar mensaje
    showMessage(message, type = 'info') {
        // Remover mensaje anterior si existe
        const existingMessage = document.querySelector('.message-notification');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-notification';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease-out;
            background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
        `;

        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        // Remover después de 4 segundos
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => messageDiv.remove(), 300);
        }, 4000);
    }

    // Cerrar sesión
    logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    }
}

// Verificar autenticación
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    
    // Crear instancia global del gestor de documentos
    window.documentManager = new DocumentManager();

    // Agregar estilos para animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
