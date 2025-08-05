// JavaScript específico para documentos.html
// Versión adaptada a los IDs del HTML

class DocumentManagerHTML {
    constructor() {
        this.storageKey = 'slep_documentos_html';
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.currentEditingDocId = null; // Para controlar el modo de edición
        this.originalTabText = null; // Para guardar el texto original de la pestaña
        this.init();
        this.createSampleDocumentIfEmpty();
    }

    init() {
        this.setupEventListeners();
        this.loadStatistics();
        this.loadDocuments();
        this.updateUserInfo();
        this.setupAutoActaNumber();
        this.initializeRBDField();
    }

    // Crear documento de prueba si no hay documentos
    createSampleDocumentIfEmpty() {
        const documents = this.getDocuments();
        if (documents.length === 0) {
            const sampleDoc = {
                id: 'sample_doc_' + Date.now(),
                acta: 'ACTA-001-2025',
                objetivo: 'Fortalecer las capacidades de liderazgo pedagógico en el establecimiento',
                asesor1: 'María González Pérez',
                asesor2: 'Carlos Rodríguez Silva',
                establecimiento: 'Escuela Gabriela Mistral',
                rbd: '111',
                fecha: '2025-08-05',
                hora: '09:00',
                horaTermino: '11:30',
                modalidad: 'Presencial',
                cicloApoyo: 'Ciclo 1',
                capacidadBasal: 'Liderazgo Pedagógico',
                nivelImplementacion: 'Inicial',
                rolProfesional: 'Director/a',
                objetivoVisita: 'Acompañar al equipo directivo en la implementación de estrategias de liderazgo pedagógico para mejorar los aprendizajes.',
                antecedentes: 'El establecimiento ha mostrado interés en fortalecer las prácticas de liderazgo pedagógico.',
                instrumentos: 'Pauta de observación, entrevistas semi-estructuradas, análisis documental.',
                practica: '',
                actividades: 'Reunión con equipo directivo, observación de clases, revisión de planificaciones pedagógicas.',
                acuerdos: 'Implementar reuniones semanales de coordinación pedagógica. Establecer protocolo de observación de clases. Responsable: Director/a. Fecha: 15 de agosto de 2025.',
                aspectosPositivos: 'Compromiso del equipo directivo con el mejoramiento. Disposición a implementar nuevas estrategias.',
                areasMejora: 'Mejorar la comunicación interna entre docentes. Establecer sistemas de seguimiento más efectivos.',
                createdAt: new Date().toISOString(),
                createdBy: this.currentUser?.username || 'Usuario Demo',
                updatedAt: null,
                updatedBy: null
            };
            
            this.saveDocument(sampleDoc);
            this.showMessage('✅ Documento de ejemplo creado para demostración', 'success');
        }
    }

    setupEventListeners() {
        // Formulario principal
        const uploadForm = document.getElementById('uploadForm');
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // Buscador de ACTA
        const searchActa = document.getElementById('searchActa');
        if (searchActa) {
            searchActa.addEventListener('input', (e) => this.searchDocuments(e.target.value));
            searchActa.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchDocuments(e.target.value);
                }
            });
        }
        
        // Manejar cambio en establecimiento
        const establecimientoSelect = document.getElementById('establecimiento');
        if (establecimientoSelect) {
            establecimientoSelect.addEventListener('change', (e) => this.handleEstablecimientoChange(e.target.value));
        }
    }

    // Manejar envío del formulario
    handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = this.getFormData();
        
        if (this.currentEditingDocId) {
            // Actualizar documento existente
            this.updateDocument(formData);
        } else {
            // Crear nuevo documento
            const completeDocument = {
                id: this.generateId(),
                ...formData,
                createdBy: this.currentUser.username,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Guardar documento
            this.saveDocument(completeDocument);
            this.showMessage('Documento registrado exitosamente con ACTA: ' + completeDocument.acta, 'success');
        }
        
        // Limpiar formulario y resetear estado
        this.clearForm();
        this.currentEditingDocId = null;
        
        // Restaurar botón de guardar a su estado original
        const editButtonsContainer = document.getElementById('editButtonsContainer');
        const formNavigation = document.querySelector('.form-navigation');
        
        if (editButtonsContainer && formNavigation) {
            // Crear el botón submit restaurado
            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.id = 'submitBtn';
            submitBtn.className = 'nav-btn primary';
            submitBtn.innerHTML = '💾 Guardar Documento';
            submitBtn.style.cssText = `
                background: #667eea;
                color: white;
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            // Reemplazar el contenedor con el botón original
            formNavigation.replaceChild(submitBtn, editButtonsContainer);
        } else {
            // Fallback: restaurar botón existente
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.innerHTML = '💾 Guardar Documento';
                submitBtn.style.cssText = `
                    background: #667eea;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                `;
            }
        }
        
        // Restaurar texto original de la pestaña
        this.restoreTabText();
        
        // Quitar resaltado de edición si estaba activo
        this.removeEditHighlight();
        
        // Generar nuevo número de acta para el próximo documento
        this.setupAutoActaNumber();
        
        // Actualizar estadísticas y mostrar documentos
        this.loadStatistics();
        this.switchToDocuments();
        this.loadDocuments();
    }

    // Actualizar documento existente
    updateDocument(formData) {
        let documents = this.getDocuments();
        const docIndex = documents.findIndex(doc => doc.id === this.currentEditingDocId);
        
        if (docIndex === -1) {
            this.showMessage('Error: Documento no encontrado para actualizar', 'error');
            return;
        }
        
        // Mantener datos originales y actualizar con nuevos datos
        const originalDoc = documents[docIndex];
        const updatedDocument = {
            ...originalDoc,
            ...formData,
            updatedAt: new Date().toISOString(),
            updatedBy: this.currentUser.username
        };
        
        documents[docIndex] = updatedDocument;
        localStorage.setItem(this.storageKey, JSON.stringify(documents));
        
        this.showMessage('Documento actualizado exitosamente: ' + updatedDocument.acta, 'success');
    }

    // Obtener datos del formulario
    getFormData() {
        // Manejar el establecimiento (si es "otro", usar el campo personalizado)
        let establecimientoValue = document.getElementById('establecimiento')?.value || '';
        if (establecimientoValue === 'Otro establecimiento') {
            const otroEstablecimiento = document.getElementById('otroEstablecimiento')?.value || '';
            establecimientoValue = otroEstablecimiento;
        }
        
        return {
            // Datos básicos
            acta: document.getElementById('acta')?.value || '',
            objetivo: document.getElementById('objetivo')?.value || '',
            asesor1: document.getElementById('asesor1')?.value || '',
            asesor2: document.getElementById('asesor2')?.value || '',
            establecimiento: establecimientoValue,
            rbd: document.getElementById('rbd')?.value || '',
            fecha: document.getElementById('fecha')?.value || '',
            hora: document.getElementById('hora')?.value || '',
            horaTermino: document.getElementById('horaTermino')?.value || '',
            modalidad: document.getElementById('modalidad')?.value || '',
            cicloApoyo: document.getElementById('cicloApoyo')?.value || '',
            capacidadBasal: document.getElementById('capacidadBasal')?.value || '',
            nivelImplementacion: document.getElementById('nivelImplementacion')?.value || '',
            rolProfesional: document.getElementById('rolProfesional')?.value || '',
            
            // Desarrollo de la visita
            objetivoVisita: document.getElementById('objetivoVisita')?.value || '',
            antecedentes: document.getElementById('antecedentes')?.value || '',
            instrumentos: document.getElementById('instrumentos')?.value || '',
            practica: document.getElementById('practica')?.value || '',
            actividades: document.getElementById('actividades')?.value || '',
            acuerdos: document.getElementById('acuerdos')?.value || '',
            aspectosPositivos: document.getElementById('aspectosPositivos')?.value || '',
            areasMejora: document.getElementById('areasMejora')?.value || ''
        };
    }

    // Validar formulario
    validateForm() {
        const requiredFields = [
            'acta', 'objetivo', 'asesor1', 'establecimiento', 'rbd', 
            'fecha', 'hora', 'horaTermino', 'modalidad', 'cicloApoyo', 
            'capacidadBasal', 'nivelImplementacion', 'rolProfesional',
            'objetivoVisita', 'actividades', 'acuerdos', 'aspectosPositivos', 'areasMejora'
        ];

        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                this.showMessage(`El campo ${fieldId} es obligatorio`, 'error');
                if (field) field.focus();
                return false;
            }
        }
        
        // Validación especial para "Otro establecimiento"
        const establecimientoSelect = document.getElementById('establecimiento');
        if (establecimientoSelect && establecimientoSelect.value === 'Otro establecimiento') {
            const otroEstablecimiento = document.getElementById('otroEstablecimiento');
            if (!otroEstablecimiento || !otroEstablecimiento.value.trim()) {
                this.showMessage('Debe especificar el nombre del establecimiento', 'error');
                if (otroEstablecimiento) otroEstablecimiento.focus();
                return false;
            }
            
            // Para "Otro establecimiento", también validar que se haya ingresado el RBD manualmente
            const rbdField = document.getElementById('rbd');
            if (!rbdField || !rbdField.value.trim()) {
                this.showMessage('Debe ingresar el RBD para el establecimiento especificado', 'error');
                if (rbdField) rbdField.focus();
                return false;
            }
        }

        // Validar horarios
        const hora = document.getElementById('hora').value;
        const horaTermino = document.getElementById('horaTermino').value;
        if (hora >= horaTermino) {
            this.showMessage('La hora de término debe ser posterior a la hora de inicio', 'error');
            return false;
        }

        return true;
    }

    // Guardar documento
    saveDocument(document) {
        let documents = this.getDocuments();
        documents.push(document);
        localStorage.setItem(this.storageKey, JSON.stringify(documents));
    }

    // Obtener documentos
    getDocuments() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    // Cargar documentos
    loadDocuments() {
        const documents = this.getDocuments();
        this.displayDocuments(documents);
    }

    // Crear tarjeta de documento
    createDocumentCard(doc, searchTerm = '') {
        const createdDate = new Date(doc.createdAt).toLocaleDateString('es-ES');
        
        // Resaltar término de búsqueda en ACTA
        let displayActa = doc.acta;
        if (searchTerm) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            displayActa = doc.acta.replace(regex, '<mark style="background: #ffd700; padding: 2px 4px; border-radius: 3px;">$1</mark>');
        }
        
        // Determinar el estado del documento para la imagen
        const isRecent = new Date(doc.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const statusIcon = isRecent ? '../images/new-badge.png' : '../images/document-icon.png';
        
        return `
            <div class="document-card">
                <div class="doc-header">
                    <div class="doc-acta" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 0.5rem 1rem;
                        border-radius: 20px;
                        font-weight: bold;
                        font-size: 0.9rem;
                        box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
                        border: 2px solid #4c51bf;
                        position: relative;
                    ">
                        ${displayActa}
                        <img src="${statusIcon}" alt="Status" class="status-icon" style="
                            position: absolute;
                            top: -8px;
                            right: -8px;
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            border: 2px solid white;
                            background: white;
                        " onerror="this.style.display='none'">
                    </div>
                    <small style="color: #666; font-weight: 500;">${createdDate}</small>
                </div>
                
                <div class="doc-title" style="color: #1f2937; font-size: 1.2rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <img src="../images/school-icon.png" alt="Escuela" style="width: 20px; height: 20px;" onerror="this.style.display='none'">
                    ${doc.establecimiento}
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem;">
                    <div class="doc-info">
                        <span class="icon">🏢</span> RBD: <strong>${doc.rbd}</strong>
                    </div>
                    <div class="doc-info">
                        <span class="icon">📅</span> ${new Date(doc.fecha).toLocaleDateString('es-ES')}
                    </div>
                    <div class="doc-info">
                        <span class="icon">⏰</span> ${doc.hora} - ${doc.horaTermino}
                    </div>
                    <div class="doc-info">
                        <span class="icon">📍</span> ${doc.modalidad}
                    </div>
                </div>
                
                <div class="doc-info" style="margin-bottom: 1rem; border-left: 3px solid #667eea; padding-left: 0.5rem;">
                    <span class="icon">👨‍🏫</span> <strong>Asesor:</strong> ${doc.asesor1}
                </div>
                
                <div class="doc-description">
                    <strong>Objetivo:</strong> ${doc.objetivoVisita.substring(0, 100)}${doc.objetivoVisita.length > 100 ? '...' : ''}
                </div>
                
                <div class="doc-actions" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn-small btn-view" onclick="documentManagerHTML.viewDocument('${doc.id}')" style="
                        background: #667eea;
                        color: white;
                        padding: 0.6rem 1rem;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        flex: 1;
                        position: relative;
                    ">
                        👁️ Ver Completo
                        <img src="../images/view-icon.png" alt="Ver" style="width: 16px; height: 16px; margin-left: 4px;" onerror="this.style.display='none'">
                    </button>
                    <button class="btn-small btn-edit" onclick="documentManagerHTML.editDocument('${doc.id}')" 
                            onmousedown="this.style.transform='scale(0.95)'; this.innerHTML='⏳ Cargando...'"
                            onmouseup="this.style.transform='scale(1)'"
                            style="
                        background: #f59e0b;
                        color: white;
                        padding: 0.6rem 1rem;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        flex: 1;
                        position: relative;
                    ">
                        ✍️ Editar
                        <img src="../images/edit-icon.png" alt="Editar" style="width: 16px; height: 16px; margin-left: 4px;" onerror="this.style.display='none'">
                    </button>
                    <button class="btn-small btn-delete" onclick="documentManagerHTML.deleteDocument('${doc.id}')" style="
                        background: #e53e3e;
                        color: white;
                        padding: 0.6rem 1rem;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        flex: 1;
                        position: relative;
                    ">
                        🗑️ Eliminar
                        <img src="../images/delete-icon.png" alt="Eliminar" style="width: 16px; height: 16px; margin-left: 4px;" onerror="this.style.display='none'">
                    </button>
                    <button class="btn-small btn-pdf" onclick="documentManagerHTML.exportSingleDocumentToPDF('${doc.id}')" style="
                        background: #dc3545;
                        color: white;
                        padding: 0.6rem 1rem;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        flex: 1;
                        position: relative;
                    ">
                        📄 PDF
                        <img src="../images/pdf-icon.png" alt="PDF" style="width: 16px; height: 16px; margin-left: 4px;" onerror="this.style.display='none'">
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

        const modal = this.createDocumentModal(doc);
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    // Crear modal de documento
    createDocumentModal(doc) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        modalContent.innerHTML = `
            <!-- Header del modal -->
            <div class="modal-header">
                <div class="modal-header-left">
                    <img src="../images/document-large.png" alt="Documento" style="width: 32px; height: 32px; margin-right: 0.5rem;" onerror="this.style.display='none'">
                    <div>
                        <h2>📋 ${doc.acta}</h2>
                        <p>Documento de Acompañamiento Pedagógico</p>
                    </div>
                </div>
                <button class="modal-close-btn" onclick="this.closest('.modal-overlay').remove()">
                    <img src="../images/close-icon.png" alt="Cerrar" style="width: 16px; height: 16px;" onerror="this.innerHTML='×'">
                </button>
            </div>
            
            <!-- Cuerpo del modal -->
            <div class="modal-body">
                <!-- Grid de información básica -->
                <div class="modal-info-grid">
                    <div class="modal-info-section">
                        <div class="section-header">
                            <img src="../images/school-large.png" alt="Establecimiento" style="width: 24px; height: 24px; margin-right: 0.5rem;" onerror="this.style.display='none'">
                            <h3>🏢 Información del Establecimiento</h3>
                        </div>
                        <p><strong>Nombre:</strong> ${doc.establecimiento}</p>
                        <p><strong>RBD:</strong> ${doc.rbd}</p>
                    </div>
                    
                    <div class="modal-info-section">
                        <div class="section-header">
                            <img src="../images/calendar-icon.png" alt="Fecha" style="width: 24px; height: 24px; margin-right: 0.5rem;" onerror="this.style.display='none'">
                            <h3>📅 Detalles de la Visita</h3>
                        </div>
                        <p><strong>Fecha:</strong> ${new Date(doc.fecha).toLocaleDateString('es-ES')}</p>
                        <p><strong>Horario:</strong> ${doc.hora} - ${doc.horaTermino}</p>
                        <p><strong>Modalidad:</strong> ${doc.modalidad}</p>
                        <p><strong>Ciclo:</strong> ${doc.cicloApoyo}</p>
                    </div>
                    
                    <div class="modal-info-section">
                        <div class="section-header">
                            <img src="../images/advisor-icon.png" alt="Asesor" style="width: 24px; height: 24px; margin-right: 0.5rem;" onerror="this.style.display='none'">
                            <h3>👥 Equipo de Asesores</h3>
                        </div>
                        <p><strong>Asesor Principal:</strong> ${doc.asesor1}</p>
                        ${doc.asesor2 ? `<p><strong>Asesor Secundario:</strong> ${doc.asesor2}</p>` : '<p><em>Sin asesor secundario</em></p>'}
                        <p><strong>Rol Profesional:</strong> ${doc.rolProfesional || 'No especificado'}</p>
                    </div>
                </div>
                
                <!-- Secciones de contenido -->
                <div class="modal-content-section">
                    <h3>🎯 Objetivo Estratégico</h3>
                    <p>${doc.objetivo}</p>
                </div>
                
                <div class="modal-content-section">
                    <h3>💡 Capacidades y Nivel</h3>
                    <p><strong>Capacidad Basal Focalizada:</strong> ${doc.capacidadBasal}</p>
                    <p><strong>Nivel de Implementación:</strong> ${doc.nivelImplementacion}</p>
                </div>
                
                <div class="modal-content-section">
                    <h3>🎯 Objetivo de la Visita</h3>
                    <p>${doc.objetivoVisita}</p>
                </div>
                
                ${doc.antecedentes ? `
                    <div class="modal-content-section">
                        <h3>📋 Antecedentes</h3>
                        <p>${doc.antecedentes}</p>
                    </div>
                ` : ''}
                
                ${doc.instrumentos ? `
                    <div class="modal-content-section">
                        <h3>🔧 Instrumentos/Insumos Utilizados</h3>
                        <p>${doc.instrumentos}</p>
                    </div>
                ` : ''}
                
                ${doc.practica ? `
                    <div class="modal-content-section">
                        <h3>⚠️ Práctica Problemática</h3>
                        <p>${doc.practica}</p>
                    </div>
                ` : ''}
                
                <div class="modal-content-section">
                    <h3>🔄 Actividades Realizadas</h3>
                    <p>${doc.actividades}</p>
                </div>
                
                <div class="modal-content-section">
                    <h3>📝 Acuerdos/Fecha de Implementación/Responsables</h3>
                    <p>${doc.acuerdos}</p>
                </div>
                
                <div class="modal-content-section">
                    <h3>✅ Aspectos Positivos Observados</h3>
                    <p>${doc.aspectosPositivos}</p>
                </div>
                
                <div class="modal-content-section">
                    <h3>📈 Áreas de Mejora Identificadas</h3>
                    <p>${doc.areasMejora}</p>
                </div>
            </div>
            
            <!-- Footer del modal -->
            <div class="modal-footer">
                <p><strong>📝 Creado por:</strong> ${doc.createdBy}</p>
                <p><strong>📅 Fecha de creación:</strong> ${new Date(doc.createdAt).toLocaleString('es-ES')}</p>
                ${doc.updatedBy ? `
                    <p><strong>✏️ Última actualización por:</strong> ${doc.updatedBy}</p>
                    <p><strong>🕐 Fecha de actualización:</strong> ${new Date(doc.updatedAt).toLocaleString('es-ES')}</p>
                ` : ''}
            </div>
        `;

        modal.appendChild(modalContent);
        
        // Cerrar modal al hacer clic fuera del contenido
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                modal.remove();
            }
        });
        
        return modal;
    }

    // Editar documento
    editDocument(docId) {
        // Mostrar feedback inmediato
        this.showMessage('Cargando documento para edición...', 'info');
        
        const documents = this.getDocuments();
        const doc = documents.find(d => d.id === docId);
        
        if (!doc) {
            this.showMessage('Documento no encontrado', 'error');
            return;
        }

        // Cambiar a la pestaña de nuevo documento PRIMERO
        const newDocBtn = document.querySelector('[data-maintab="nuevo-documento"]');
        if (newDocBtn) {
            newDocBtn.click();
            
            // Cambiar el texto de la pestaña a "Editar Documento"
            const originalText = newDocBtn.innerHTML;
            newDocBtn.innerHTML = '✏️ Editar Documento';
            newDocBtn.style.cssText = `
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
                padding: 1rem 2rem;
                border: none;
                font-weight: 700;
                font-size: 1.1rem;
                border-radius: 10px 10px 0 0;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(245, 158, 11, 0.3);
            `;
            
            // Guardar el texto original para restaurarlo después
            this.originalTabText = originalText;
        }
        
        // Dar tiempo para que cambie la pestaña, luego llenar formulario
        setTimeout(() => {
            // Llenar el formulario con los datos del documento
            this.populateFormWithDocument(doc);
            
            // Marcar que estamos editando
            this.currentEditingDocId = docId;
            
            // Cambiar el botón de guardar
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.innerHTML = '💾 Actualizar Documento';
                submitBtn.style.cssText = `
                    background: #f59e0b;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                    transition: all 0.3s ease;
                `;
            }
            
            // Agregar botón para cancelar edición
            this.addCancelEditButton();
            
            // Hacer scroll al inicio del formulario
            const formContainer = document.querySelector('.upload-section');
            if (formContainer) {
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Mostrar mensaje de éxito con información del documento
            this.showMessage(`✅ Editando: ${doc.acta} - ${doc.establecimiento}`, 'success');
            
            // Resaltar visualmente el formulario
            this.highlightEditMode();
            
        }, 100); // Pequeño delay para asegurar que la pestaña cambie
    }

    // Llenar formulario con datos del documento
    populateFormWithDocument(doc) {
        // Datos básicos
        this.setFieldValue('acta', doc.acta);
        this.setFieldValue('objetivo', doc.objetivo);
        this.setFieldValue('asesor1', doc.asesor1);
        this.setFieldValue('asesor2', doc.asesor2);
        this.setFieldValue('establecimiento', doc.establecimiento);
        this.setFieldValue('rbd', doc.rbd);
        this.setFieldValue('fecha', doc.fecha);
        this.setFieldValue('hora', doc.hora);
        this.setFieldValue('horaTermino', doc.horaTermino);
        this.setFieldValue('modalidad', doc.modalidad);
        this.setFieldValue('cicloApoyo', doc.cicloApoyo);
        this.setFieldValue('capacidadBasal', doc.capacidadBasal);
        this.setFieldValue('nivelImplementacion', doc.nivelImplementacion);
        this.setFieldValue('rolProfesional', doc.rolProfesional);
        
        // Desarrollo de la visita
        this.setFieldValue('objetivoVisita', doc.objetivoVisita);
        this.setFieldValue('antecedentes', doc.antecedentes);
        this.setFieldValue('instrumentos', doc.instrumentos);
        this.setFieldValue('practica', doc.practica);
        this.setFieldValue('actividades', doc.actividades);
        this.setFieldValue('acuerdos', doc.acuerdos);
        this.setFieldValue('aspectosPositivos', doc.aspectosPositivos);
        this.setFieldValue('areasMejora', doc.areasMejora);
        
        // Manejar establecimiento especial si no está en la lista
        const establecimientoSelect = document.getElementById('establecimiento');
        if (establecimientoSelect) {
            const optionExists = Array.from(establecimientoSelect.options).some(option => option.value === doc.establecimiento);
            if (!optionExists && doc.establecimiento) {
                // Si el establecimiento no está en la lista, usar "Otro establecimiento"
                establecimientoSelect.value = 'Otro establecimiento';
                this.handleEstablecimientoChange('Otro establecimiento');
                
                // Esperar un poco para que se cree el campo y luego llenarlo
                setTimeout(() => {
                    this.setFieldValue('otroEstablecimiento', doc.establecimiento);
                }, 100);
            }
        }
        
        // Ajustar estilos de campos editables
        this.makeFieldsEditable();
    }

    // Establecer valor de campo
    setFieldValue(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field && value !== undefined && value !== null) {
            field.value = value;
            
            // Disparar evento change para campos select
            if (field.tagName === 'SELECT') {
                field.dispatchEvent(new Event('change'));
            }
        }
    }

    // Hacer campos editables durante edición
    makeFieldsEditable() {
        // Hacer el campo ACTA editable durante edición
        const actaField = document.getElementById('acta');
        if (actaField) {
            actaField.readOnly = false;
            actaField.style.cssText = `
                background: #fef3c7;
                border: 2px solid #f59e0b;
                color: #92400e;
                font-weight: bold;
                font-size: 1.1rem;
                text-align: center;
                box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
            `;
            
            // Actualizar etiqueta
            const label = actaField.previousElementSibling;
            if (label) {
                label.innerHTML = '✏️ N° ACTA (Editando) <span style="color: #f59e0b;">📝</span>';
                label.style.color = '#f59e0b';
            }
        }
        
        // Hacer el campo RBD editable si es necesario
        const rbdField = document.getElementById('rbd');
        if (rbdField) {
            rbdField.readOnly = false;
            rbdField.style.cssText = `
                background: #fef3c7;
                border: 2px solid #f59e0b;
                color: #92400e;
                font-weight: bold;
                text-align: center;
                box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
            `;
        }
    }

    // Agregar botón cancelar edición
    addCancelEditButton() {
        // Verificar si ya existe
        if (document.getElementById('cancelEditBtn')) {
            return;
        }
        
        const formNavigation = document.querySelector('.form-navigation');
        if (formNavigation) {
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.id = 'cancelEditBtn';
            cancelBtn.className = 'nav-btn';
            cancelBtn.innerHTML = '❌ Cancelar Edición';
            cancelBtn.style.cssText = `
                background: #6b7280;
                color: white;
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            cancelBtn.addEventListener('click', () => this.cancelEdit());
            
            // Buscar el botón de submit y organizarlos en el mismo contenedor
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                // Crear contenedor para los botones de edición
                const editButtonsContainer = document.createElement('div');
                editButtonsContainer.id = 'editButtonsContainer';
                editButtonsContainer.style.cssText = `
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 1rem;
                    flex-wrap: wrap;
                `;
                
                // Clonar el botón submit para mantener sus eventos
                const newSubmitBtn = submitBtn.cloneNode(true);
                newSubmitBtn.style.margin = '0';
                
                // Agregar los botones al contenedor en orden: Cancelar, Actualizar
                editButtonsContainer.appendChild(cancelBtn);
                editButtonsContainer.appendChild(newSubmitBtn);
                
                // Reemplazar el botón submit original con el nuevo contenedor
                submitBtn.parentNode.replaceChild(editButtonsContainer, submitBtn);
                
                // Asegurar que el nuevo botón tenga los eventos correctos
                newSubmitBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Disparar el evento submit del formulario
                    const form = document.getElementById('uploadForm');
                    if (form) {
                        form.dispatchEvent(new Event('submit'));
                    }
                });
            }
        }
    }

    // Resaltar modo de edición
    highlightEditMode() {
        // Resaltar el contenedor del formulario
        const uploadSection = document.querySelector('.upload-section');
        if (uploadSection) {
            uploadSection.style.cssText = `
                border: 3px solid #f59e0b;
                border-radius: 15px;
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
                position: relative;
                overflow: visible;
            `;
            
            // Agregar badge de "EDITANDO"
            const editBadge = document.createElement('div');
            editBadge.id = 'editModeBadge';
            editBadge.innerHTML = '✏️ EDITANDO DOCUMENTO';
            editBadge.style.cssText = `
                position: absolute;
                top: -15px;
                left: 20px;
                background: #f59e0b;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-weight: bold;
                font-size: 0.9rem;
                box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
                z-index: 10;
                animation: pulse 2s infinite;
            `;
            
            // Agregar animación CSS si no existe
            if (!document.getElementById('editModeStyles')) {
                const style = document.createElement('style');
                style.id = 'editModeStyles';
                style.textContent = `
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            uploadSection.style.position = 'relative';
            uploadSection.appendChild(editBadge);
        }
        
        // Resaltar las pestañas del formulario
        const formTabsNav = document.querySelector('.form-tabs-navigation');
        if (formTabsNav) {
            formTabsNav.style.cssText = `
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                border-radius: 10px;
                padding: 0.5rem;
                margin-bottom: 1rem;
                box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
            `;
        }
    }

    // Quitar resaltado del modo edición
    removeEditHighlight() {
        const uploadSection = document.querySelector('.upload-section');
        if (uploadSection) {
            uploadSection.style.cssText = '';
        }
        
        const editBadge = document.getElementById('editModeBadge');
        if (editBadge) {
            editBadge.remove();
        }
        
        const formTabsNav = document.querySelector('.form-tabs-navigation');
        if (formTabsNav) {
            formTabsNav.style.cssText = '';
        }
    }

    // Restaurar texto original de la pestaña
    restoreTabText() {
        const newDocBtn = document.querySelector('[data-maintab="nuevo-documento"]');
        if (newDocBtn && this.originalTabText) {
            newDocBtn.innerHTML = this.originalTabText;
            newDocBtn.style.cssText = ''; // Limpiar estilos personalizados
            this.originalTabText = null; // Limpiar la referencia
        }
    }

    // Cancelar edición
    cancelEdit() {
        if (confirm('¿Estás seguro de que deseas cancelar la edición? Se perderán los cambios no guardados.')) {
            this.currentEditingDocId = null;
            this.clearForm();
            this.setupAutoActaNumber();
            
            // Restaurar botón de guardar a su estado original
            const editButtonsContainer = document.getElementById('editButtonsContainer');
            const formNavigation = document.querySelector('.form-navigation');
            
            if (editButtonsContainer && formNavigation) {
                // Crear el botón submit restaurado
                const submitBtn = document.createElement('button');
                submitBtn.type = 'submit';
                submitBtn.id = 'submitBtn';
                submitBtn.className = 'nav-btn primary';
                submitBtn.innerHTML = '💾 Guardar Documento';
                submitBtn.style.cssText = `
                    background: #667eea;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                `;
                
                // Reemplazar el contenedor con el botón original
                formNavigation.replaceChild(submitBtn, editButtonsContainer);
            }
            
            // Restaurar texto original de la pestaña
            this.restoreTabText();
            
            // Quitar resaltado de edición
            this.removeEditHighlight();
            
            this.showMessage('Edición cancelada', 'info');
        }
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

    // Cargar estadísticas
    loadStatistics() {
        const documents = this.getDocuments();
        const establecimientos = [...new Set(documents.map(doc => doc.establecimiento))];
        const asesores = [...new Set(documents.map(doc => doc.asesor1))];
        
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const thisMonthDocs = documents.filter(doc => {
            const docDate = new Date(doc.createdAt);
            return docDate.getMonth() === thisMonth && docDate.getFullYear() === thisYear;
        });

        this.updateStatElement('totalDocs', documents.length);
        this.updateStatElement('totalEstablecimientos', establecimientos.length);
        this.updateStatElement('recentUploads', thisMonthDocs.length);
        this.updateStatElement('totalAsesores', asesores.length);
    }

    // Actualizar elemento estadística
    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Cambiar a pestaña de documentos
    switchToDocuments() {
        // Buscar botón de documentos guardados y hacer clic
        const docsBtn = document.querySelector('[data-maintab="documentos-guardados"]');
        if (docsBtn) {
            docsBtn.click();
        }
    }

    // Limpiar formulario
    clearForm() {
        const form = document.getElementById('uploadForm');
        if (form) {
            form.reset();
        }
        
        // Limpiar campo adicional de "otro establecimiento" si existe
        const otroEstablecimientoField = document.getElementById('otroEstablecimiento');
        if (otroEstablecimientoField) {
            otroEstablecimientoField.closest('.form-group').remove();
        }
        
        // Configurar campo RBD como solo lectura y limpiar estilos
        const rbdField = document.getElementById('rbd');
        if (rbdField) {
            rbdField.value = '';
            rbdField.readOnly = true;
            rbdField.placeholder = 'Seleccione un establecimiento primero';
            rbdField.style.cssText = `
                background: #f8fafc;
                border-color: #e2e8f0;
                color: #64748b;
                text-align: center;
            `;
        }
    }

    // Actualizar info del usuario
    updateUserInfo() {
        const userInfoElement = document.getElementById('userInfo');
        if (userInfoElement && this.currentUser) {
            userInfoElement.textContent = `👤 ${this.currentUser.username}`;
        }
    }

    // Generar ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Mostrar mensaje
    showMessage(message, type = 'info') {
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
            background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
        `;

        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 4000);
    }

    // Cerrar sesión
    logout() {
        localStorage.removeItem('currentUser');
        // Detectar si estamos en una subcarpeta
        const isInSubfolder = window.location.pathname.includes('/documentos/');
        window.location.href = isInSubfolder ? '../index.html' : 'index.html';
    }

    // Configurar número de acta automático
    setupAutoActaNumber() {
        const actaField = document.getElementById('acta');
        if (actaField) {
            // Generar número automático
            const nextActaNumber = this.getNextActaNumber();
            actaField.value = nextActaNumber;
            actaField.readOnly = true; // No permitir edición manual
            
            // Agregar estilos especiales al campo
            actaField.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-weight: bold;
                font-size: 1.1rem;
                text-align: center;
                border: 3px solid #4c51bf;
                box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
            `;
            
            // Agregar etiqueta especial
            const label = actaField.previousElementSibling;
            if (label) {
                label.innerHTML = '🏷️ N° ACTA (Automático) <span style="color: #10b981;">✓</span>';
                label.style.color = '#4c51bf';
                label.style.fontWeight = 'bold';
            }
        }
    }

    // Obtener el siguiente número de acta
    getNextActaNumber() {
        const documents = this.getDocuments();
        const currentYear = new Date().getFullYear();
        
        // Filtrar documentos del año actual
        const currentYearDocs = documents.filter(doc => {
            if (doc.acta) {
                const actaParts = doc.acta.split('-');
                return actaParts.length >= 3 && actaParts[2] === currentYear.toString();
            }
            return false;
        });
        
        // Encontrar el número más alto
        let maxNumber = 0;
        currentYearDocs.forEach(doc => {
            const actaParts = doc.acta.split('-');
            if (actaParts.length >= 2) {
                const number = parseInt(actaParts[1]);
                if (!isNaN(number) && number > maxNumber) {
                    maxNumber = number;
                }
            }
        });
        
        // Generar el siguiente número
        const nextNumber = maxNumber + 1;
        const formattedNumber = nextNumber.toString().padStart(3, '0');
        
        return `ACTA-${formattedNumber}-${currentYear}`;
    }

    // Buscar documentos por ACTA
    searchDocuments(searchTerm) {
        const documents = this.getDocuments();
        
        if (!searchTerm.trim()) {
            // Si no hay término de búsqueda, mostrar todos
            this.displayDocuments(documents);
            return;
        }
        
        // Filtrar por número de acta
        const filteredDocs = documents.filter(doc => {
            const acta = doc.acta.toLowerCase();
            const search = searchTerm.toLowerCase();
            
            // Buscar por ACTA completa o solo por número
            return acta.includes(search) || 
                   acta.includes(`acta-${search}`) ||
                   acta.split('-')[1] === search.padStart(3, '0');
        });
        
        this.displayDocuments(filteredDocs, searchTerm);
    }

    // Mostrar documentos (separado de loadDocuments para reutilizar)
    displayDocuments(documents, searchTerm = '') {
        const grid = document.getElementById('documentsGrid');
        
        if (!grid) return;

        if (documents.length === 0) {
            const message = searchTerm 
                ? `No se encontraron documentos con ACTA: "${searchTerm}"`
                : 'No hay documentos guardados';
                
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">
                    <h3>${message}</h3>
                    ${searchTerm ? '<p>Intenta con otro número de ACTA</p>' : '<p>Los documentos aparecerán aquí cuando sean registrados.</p>'}
                </div>
            `;
            return;
        }

        grid.innerHTML = documents.map(doc => this.createDocumentCard(doc, searchTerm)).join('');
    }
    
    // Manejar cambio en establecimiento
    handleEstablecimientoChange(value) {
        // Buscar si ya existe el campo "otro establecimiento"
        let otroEstablecimientoField = document.getElementById('otroEstablecimiento');
        
        if (value === 'Otro establecimiento') {
            // Si no existe, crear el campo
            if (!otroEstablecimientoField) {
                const establecimientoGroup = document.getElementById('establecimiento').closest('.form-group');
                const newGroup = document.createElement('div');
                newGroup.className = 'form-group';
                newGroup.innerHTML = `
                    <label for="otroEstablecimiento" class="required" style="color: #e53e3e;">
                        📝 Especificar Establecimiento
                    </label>
                    <input type="text" id="otroEstablecimiento" name="otroEstablecimiento" 
                           required placeholder="Escriba el nombre completo del establecimiento"
                           style="border-color: #e53e3e; background: #fef2f2;">
                `;
                
                // Insertar después del grupo de establecimiento
                establecimientoGroup.parentNode.insertBefore(newGroup, establecimientoGroup.nextSibling);
                
                // Enfocar el nuevo campo
                setTimeout(() => {
                    document.getElementById('otroEstablecimiento').focus();
                }, 100);
            }
        } else {
            // Si existe y no es "otro", eliminarlo
            if (otroEstablecimientoField) {
                otroEstablecimientoField.closest('.form-group').remove();
            }
        }
        
        // RBD automático DESHABILITADO para mejor rendimiento
        // this.autoCompleteRBD(value); // COMENTADO PERMANENTEMENTE
    }
    
    // Auto-completar RBD para establecimientos conocidos
    autoCompleteRBD(establecimiento) {
        const rbdField = document.getElementById('rbd');
        if (!rbdField) return;
        
        // Hacer el campo RBD de solo lectura
        rbdField.readOnly = true;
        
        // Base de datos completa de RBDs de establecimientos de Iquique
        const rbdDatabase = {
            'Escuela Básica República de Francia': '1234-5',
            'Instituto Comercial Baldomero Wolnitzky': '97',            
            'Escuela Especial Flor del Inca': '102',            
            'Escuela Artística Violeta Parra': '103',            
            'Centro de Capacitación Laboral': '105',            
            'Liceo Libertador General Bernardo O’Higgins': '107',            
            'Liceo Politécnico José Gutiérrez de la Fuente': '108',            
            'Liceo Deportivo Elena Duvauchelle Cabezón': '109',            
            'Liceo Bicentenario Domingo Santa María': '110',            
            'Escuela Gabriela Mistral': '111',            
            'Escuela Eduardo Llanos Nava': '112',            
            'Escuela Almirante Patricio Lynch': '113',            
            'Escuela Plácido Villarroel': '114',            
            'Escuela República de Croacia': '116',            
            'Escuela Paula Jaraquemada': '117',            
            'Escuela Centenario': '119',            
            'Escuela Thilda Portillo Olivares': '122',            
            'Escuela España': '123',            
            'Liceo Luis Cruz Martínez': '124',            
            'Colegio Manuel Castro Ramos': '125',            
            'Colegio República de Italia': '126',            
            'Escuela Caleta Chanavayita': '10916',            
            'Liceo Bicentenario Minero Juan Pablo II': '10917',            
            'Escuela Chipana': '12538',            
            'Escuela San Marcos': '12542',            
            'Colegio Simón Bolívar': '12632',            
            'Escuela Oasis del Saber': '12739',            
            'Liceo CEIA José Alejandro Soria Varas': '12758',            
            'Liceo Técnico Profesional de Adultos': '40429',            
            'Oasis del Saber': '33019',            
            'Intina Wawapa': '33020',            
            'Tortuguita': '33022'            
        };

        // RBD SIMPLIFICADO - Campo manual solamente
        rbdField.readOnly = false;
        rbdField.value = '';
        rbdField.placeholder = 'Ingrese RBD manualmente';
        rbdField.style.cssText = `
            background: white;
            border: 2px solid #e2e8f0;
            color: #333;
            text-align: center;
        `;
    }

    // Inicializar campo RBD - SIMPLIFICADO SIN AUTOMATIZACIÓN
    initializeRBDField() {
        const rbdField = document.getElementById('rbd');
        if (rbdField) {
            rbdField.readOnly = false; // SIEMPRE EDITABLE
            rbdField.placeholder = 'Ingrese RBD manualmente';
            rbdField.style.cssText = `
                background: white;
                border: 2px solid #e2e8f0;
                color: #333;
                text-align: center;
            `;
            
            // Actualizar el label del RBD
            const rbdLabel = rbdField.previousElementSibling;
            if (rbdLabel && rbdLabel.tagName === 'LABEL') {
                rbdLabel.innerHTML = '🏢 RBD *';
                rbdLabel.style.color = '#333';
            }
        }
    }

    // Exportar documento individual a PDF
    exportSingleDocumentToPDF(docId) {
        const documents = this.getDocuments();
        const doc = documents.find(d => d.id === docId);
        
        if (!doc) {
            this.showMessage('Documento no encontrado', 'error');
            return;
        }

        // Crear contenido HTML para el PDF individual
        const pdfContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Documento ${doc.acta} - SLEP IQUIQUE</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
                    .header { text-align: center; border-bottom: 3px solid #667eea; padding-bottom: 20px; margin-bottom: 30px; }
                    .document { padding: 20px; border: 2px solid #667eea; border-radius: 10px; }
                    .doc-title { background: #667eea; color: white; padding: 20px; text-align: center; font-size: 1.5em; font-weight: bold; margin: -20px -20px 30px -20px; border-radius: 8px 8px 0 0; }
                    .doc-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
                    .info-item { background: #f8f9fa; padding: 15px; border-left: 5px solid #667eea; border-radius: 5px; }
                    .info-label { font-weight: bold; color: #333; font-size: 0.9em; text-transform: uppercase; }
                    .info-value { margin-top: 8px; font-size: 1.1em; }
                    .section { margin: 25px 0; }
                    .section-title { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; font-weight: bold; border-radius: 8px; }
                    .section-content { padding: 20px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 0 0 8px 8px; min-height: 60px; }
                    .footer { margin-top: 40px; padding: 20px; background: #e9ecef; border-radius: 8px; font-size: 0.9em; text-align: center; }
                    @media print { body { margin: 0; } .document { border: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏛️ SLEP IQUIQUE</h1>
                    <h2>📋 Documento de Acompañamiento Pedagógico</h2>
                    <p><strong>Fecha de exportación:</strong> ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
                </div>
                
                <div class="document">
                    <div class="doc-title">ACTA N° ${doc.acta}</div>
                    
                    <div class="doc-info">
                        <div class="info-item">
                            <div class="info-label">🏫 Establecimiento</div>
                            <div class="info-value">${doc.establecimiento}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">🏷️ RBD</div>
                            <div class="info-value">${doc.rbd}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">📅 Fecha de Visita</div>
                            <div class="info-value">${new Date(doc.fecha).toLocaleDateString('es-ES')}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">⏰ Horario</div>
                            <div class="info-value">${doc.hora} - ${doc.horaTermino}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">👤 Asesor Principal</div>
                            <div class="info-value">${doc.asesor1}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">📍 Modalidad</div>
                            <div class="info-value">${doc.modalidad}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">👔 Rol Profesional</div>
                            <div class="info-value">${doc.rolProfesional || 'No especificado'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">🔄 Ciclo de Apoyo</div>
                            <div class="info-value">${doc.cicloApoyo || 'No especificado'}</div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">🎯 Objetivo Estratégico</div>
                        <div class="section-content">${doc.objetivo || 'No especificado'}</div>
                    </div>

                    <div class="section">
                        <div class="section-title">🎯 Objetivo de la Visita</div>
                        <div class="section-content">${doc.objetivoVisita || 'No especificado'}</div>
                    </div>

                    ${doc.antecedentes ? `
                    <div class="section">
                        <div class="section-title">📋 Antecedentes</div>
                        <div class="section-content">${doc.antecedentes}</div>
                    </div>
                    ` : ''}

                    ${doc.instrumentos ? `
                    <div class="section">
                        <div class="section-title">🔧 Instrumentos/Insumos Utilizados</div>
                        <div class="section-content">${doc.instrumentos}</div>
                    </div>
                    ` : ''}

                    ${doc.practica ? `
                    <div class="section">
                        <div class="section-title">⚠️ Práctica Problemática</div>
                        <div class="section-content">${doc.practica}</div>
                    </div>
                    ` : ''}

                    <div class="section">
                        <div class="section-title">🔄 Actividades Realizadas</div>
                        <div class="section-content">${doc.actividades || 'No especificado'}</div>
                    </div>

                    <div class="section">
                        <div class="section-title">📝 Acuerdos/Fecha de Implementación/Responsables</div>
                        <div class="section-content">${doc.acuerdos || 'No especificado'}</div>
                    </div>

                    <div class="section">
                        <div class="section-title">✅ Aspectos Positivos Observados</div>
                        <div class="section-content">${doc.aspectosPositivos || 'No especificado'}</div>
                    </div>

                    <div class="section">
                        <div class="section-title">📈 Áreas de Mejora Identificadas</div>
                        <div class="section-content">${doc.areasMejora || 'No especificado'}</div>
                    </div>

                    <div class="footer">
                        <p><strong>📝 Documento creado:</strong> ${new Date(doc.createdAt).toLocaleString('es-ES')}</p>
                        ${doc.asesor2 ? `<p><strong>👤 Asesor Secundario:</strong> ${doc.asesor2}</p>` : ''}
                        <p><strong>⚡ Capacidad Basal:</strong> ${doc.capacidadBasal || 'No especificado'} | <strong>📊 Nivel:</strong> ${doc.nivelImplementacion || 'No especificado'}</p>
                        <p style="margin-top: 15px; font-style: italic; color: #666;">Este documento fue generado automáticamente por el sistema SLEP IQUIQUE</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Crear y descargar el archivo
        const blob = new Blob([pdfContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SLEP_IQUIQUE_${doc.acta}_${new Date().toISOString().slice(0, 10)}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Mostrar mensaje de éxito
        this.showMessage(`✅ Documento ${doc.acta} exportado exitosamente`, 'success');
    }
}

// Inicializar cuando esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Debes iniciar sesión para acceder a esta página');
        // Detectar si estamos en una subcarpeta
        const isInSubfolder = window.location.pathname.includes('/documentos/');
        window.location.href = isInSubfolder ? '../index.html' : 'index.html';
        return;
    }
    
    // Inicializar gestor
    window.documentManagerHTML = new DocumentManagerHTML();
});
