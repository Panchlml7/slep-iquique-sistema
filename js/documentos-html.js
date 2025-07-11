// JavaScript específico para documentos.html
// Versión adaptada a los IDs del HTML

class DocumentManagerHTML {
    constructor() {
        this.storageKey = 'slep_documentos_html';
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStatistics();
        this.loadDocuments();
        this.updateUserInfo();
        this.setupAutoActaNumber();
        this.initializeRBDField();
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
        
        // Crear documento completo
        const completeDocument = {
            id: this.generateId(),
            ...formData,
            createdBy: this.currentUser.username,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Guardar documento
        this.saveDocument(completeDocument);
        
        // Limpiar formulario
        this.clearForm();
        
        // Generar nuevo número de acta para el próximo documento
        this.setupAutoActaNumber();
        
        this.showMessage('Documento registrado exitosamente con ACTA: ' + completeDocument.acta, 'success');
        
        // Actualizar estadísticas y mostrar documentos
        this.loadStatistics();
        this.switchToDocuments();
        this.loadDocuments();
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
                    ">${displayActa}</div>
                    <small style="color: #666; font-weight: 500;">${createdDate}</small>
                </div>
                
                <div class="doc-title" style="color: #1f2937; font-size: 1.2rem; margin-bottom: 1rem;">
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
                        <span class="icon">�</span> ${doc.modalidad}
                    </div>
                </div>
                
                <div class="doc-info" style="margin-bottom: 1rem; border-left: 3px solid #667eea; padding-left: 0.5rem;">
                    <span class="icon">�</span> <strong>Asesor:</strong> ${doc.asesor1}
                </div>
                
                <div class="doc-description">
                    <strong>Objetivo:</strong> ${doc.objetivoVisita.substring(0, 100)}${doc.objetivoVisita.length > 100 ? '...' : ''}
                </div>
                
                <div class="doc-actions">
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
                        margin-right: 0.5rem;
                    ">
                        👁️ Ver Completo
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
                    ">
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

        const modal = this.createDocumentModal(doc);
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    // Crear modal de documento
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
            
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1.5rem;
                border-radius: 10px;
                margin-bottom: 2rem;
                text-align: center;
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
            ">
                <h2 style="margin: 0; font-size: 1.8rem;">📋 ${doc.acta}</h2>
                <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Documento de Acompañamiento Pedagógico</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div>
                    <h3>🏢 Información del Establecimiento</h3>
                    <p><strong>Nombre:</strong> ${doc.establecimiento}</p>
                    <p><strong>RBD:</strong> ${doc.rbd}</p>
                </div>
                
                <div>
                    <h3>📅 Detalles de la Visita</h3>
                    <p><strong>Fecha:</strong> ${new Date(doc.fecha).toLocaleDateString('es-ES')}</p>
                    <p><strong>Horario:</strong> ${doc.hora} - ${doc.horaTermino}</p>
                    <p><strong>Modalidad:</strong> ${doc.modalidad}</p>
                    <p><strong>Ciclo:</strong> ${doc.cicloApoyo}</p>
                </div>
                
                <div>
                    <h3>👥 Asesores</h3>
                    <p><strong>Asesor Principal:</strong> ${doc.asesor1}</p>
                    ${doc.asesor2 ? `<p><strong>Asesor Secundario:</strong> ${doc.asesor2}</p>` : ''}
                </div>
            </div>
            
            <div>
                <h3>🎯 Objetivo Estratégico</h3>
                <p>${doc.objetivo}</p>
            </div>
            
            <div>
                <h3>💡 Capacidades</h3>
                <p><strong>Capacidad Basal:</strong> ${doc.capacidadBasal}</p>
                <p><strong>Nivel de Implementación:</strong> ${doc.nivelImplementacion}</p>
            </div>
            
            <div>
                <h3>🎯 Objetivo de la Visita</h3>
                <p>${doc.objetivoVisita}</p>
            </div>
            
            ${doc.antecedentes ? `
                <div>
                    <h3>📋 Antecedentes</h3>
                    <p>${doc.antecedentes}</p>
                </div>
            ` : ''}
            
            ${doc.instrumentos ? `
                <div>
                    <h3>🔧 Instrumentos</h3>
                    <p>${doc.instrumentos}</p>
                </div>
            ` : ''}
            
            ${doc.practica ? `
                <div>
                    <h3>⚠️ Práctica Problemática</h3>
                    <p>${doc.practica}</p>
                </div>
            ` : ''}
            
            <div>
                <h3>✅ Actividades</h3>
                <p>${doc.actividades}</p>
            </div>
            
            <div>
                <h3>🤝 Acuerdos</h3>
                <p>${doc.acuerdos}</p>
            </div>
            
            <div>
                <h3>✨ Aspectos Positivos</h3>
                <p>${doc.aspectosPositivos}</p>
            </div>
            
            <div>
                <h3>📈 Áreas de Mejora</h3>
                <p>${doc.areasMejora}</p>
            </div>
            
            <div style="margin-top: 2rem; color: #666; font-size: 0.9rem;">
                <p><strong>Creado por:</strong> ${doc.createdBy}</p>
                <p><strong>Fecha de creación:</strong> ${new Date(doc.createdAt).toLocaleString('es-ES')}</p>
            </div>
        `;

        modal.appendChild(modalContent);
        return modal;
    }

    // Editar documento
    editDocument(docId) {
        // Para simplificar, solo mostramos un mensaje
        this.showMessage('Función de edición en desarrollo', 'info');
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
        
        // Auto-completar RBD para algunos establecimientos conocidos
        this.autoCompleteRBD(value);
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
            'Tortuguita': '33022',            
            'Arumanti': '33024',            
            'Lucerito Dorado': '33025',            
            'Aventuras de Aprender': '33026',            
            'Arcoiris del Desierto': '33027',            
            'Magia de Aprender': '33028',            
        };
        
        if (rbdDatabase[establecimiento]) {
            rbdField.value = rbdDatabase[establecimiento];
            rbdField.style.cssText = `
                background: linear-gradient(135deg, #f0fff4 0%, #e6ffed 100%);
                border-color: #10b981;
                color: #065f46;
                font-weight: bold;
                text-align: center;
                box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
            `;
            
            // Mostrar mensaje de confirmación
            this.showMessage(`✅ RBD completado automáticamente: ${rbdDatabase[establecimiento]}`, 'success');
        } else if (establecimiento === 'Otro establecimiento') {
            rbdField.value = '';
            rbdField.style.cssText = `
                background: #fef2f2;
                border-color: #f59e0b;
                color: #92400e;
                font-weight: bold;
                text-align: center;
            `;
            rbdField.placeholder = 'RBD se debe especificar manualmente';
            rbdField.readOnly = false; // Permitir edición para "Otro establecimiento"
            
            this.showMessage('⚠️ Para "Otro establecimiento" debe ingresar el RBD manualmente', 'info');
        } else {
            rbdField.value = '';
            rbdField.style.cssText = `
                background: #f8fafc;
                border-color: #e2e8f0;
                color: #64748b;
                text-align: center;
            `;
            rbdField.placeholder = 'Seleccione un establecimiento primero';
        }
    }

    // Inicializar campo RBD
    initializeRBDField() {
        const rbdField = document.getElementById('rbd');
        if (rbdField) {
            rbdField.readOnly = true;
            rbdField.placeholder = 'Seleccione un establecimiento primero';
            rbdField.style.cssText = `
                background: #f8fafc;
                border-color: #e2e8f0;
                color: #64748b;
                text-align: center;
                cursor: not-allowed;
            `;
            
            // Actualizar el label del RBD para indicar que es automático
            const rbdLabel = rbdField.previousElementSibling;
            if (rbdLabel && rbdLabel.tagName === 'LABEL') {
                rbdLabel.innerHTML = '🏢 RBD (Automático) <span style="color: #10b981; font-size: 0.8em;">✓</span>';
                rbdLabel.style.color = '#475569';
            }
        }
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
