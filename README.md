# 📊 Sistema de Gestión SLEP Iquique

## 🏢 Servicio Local de Educación Pública de Iquique
**Monitoreo de Datos y Gestión Educativa**

---

## 📋 Descripción del Proyecto

Sistema integral de gestión educativa desarrollado para el **Servicio Local de Educación Pública (SLEP) de Iquique**, orientado al monitoreo de datos, gestión de establecimientos educativos y seguimiento de procesos administrativos.

### 🎯 **Propósito Principal**
- **Monitoreo de datos** educativos del territorio de Iquique
- **Gestión centralizada** de 39 establecimientos educativos
- **Seguimiento de procesos** administrativos y pedagógicos
- **Control de acceso** y administración de usuarios del sistema

---

## 🏫 **Cobertura Territorial**

### **📊 Establecimientos Gestionados: 39**
- **� Liceos:** 10 establecimientos
- **🏫 Escuelas:** 18 establecimientos  
- **👶 Jardines Infantiles:** 12 establecimientos
- **🏢 Oficina Central SLEP:** 1 establecimiento

### **🌍 Territorios Cubiertos:**
- **Comuna de Iquique** - Establecimientos urbanos y rurales
- **Comuna de Alto Hospicio** - Establecimientos urbanos
- **Caletas y sectores rurales** - Establecimientos de difícil acceso

---

## 🔐 **Sistema de Autenticación**

### **👨‍💼 Administrador del Sistema**
- **Responsable:** Monitoreo de Datos SLEP Iquique
- **Email:** francisco.ramos@slepiquique.cl
- **Funciones:** Gestión completa del sistema y aprobación de usuarios

### **🔒 Niveles de Acceso**
1. **Administrador** - Acceso completo con 5 módulos
2. **Usuarios Aprobados** - Acceso limitado con 4 módulos
3. **Usuarios Pendientes** - Sin acceso hasta aprobación
4. **Usuarios Rechazados** - Acceso denegado

---

## 🎛️ **Módulos del Sistema**

### **👨‍💼 Para Administrador (5 módulos):**
1. **📊 Dashboard** - Panel de control y estadísticas generales
2. **🏢 Establecimientos** - Gestión de 39 centros educativos
3. **📁 Documentos** - Sistema de gestión documental
4. **✅ Habilitación** - Procesos de habilitación y validación
5. **👤 Administración** - Gestión de usuarios y permisos

### **👥 Para Usuarios Aprobados (4 módulos):**
1. **📊 Dashboard** - Panel de control personal
2. **🏢 Establecimientos** - Consulta de establecimientos
3. **📁 Documentos** - Gestión documental limitada
4. **✅ Habilitación** - Procesos de habilitación

---

## 📁 **Sistema de Documentos**

### **📄 Versiones Disponibles:**
- **`documentos.html`** - Versión principal del sistema
- **`documentos_final.html`** - Versión con mejoras visuales
- **`documentos_new.html`** - Versión de desarrollo
- **`documentos_backup.html`** - Respaldo de seguridad

### **🔧 Funcionalidades Documentales:**
- ✅ **Generación automática** de números de ACTA
- ✅ **Base de datos completa** de RBDs institucionales
- ✅ **Autocompletado** de establecimientos por RBD
- ✅ **Búsqueda avanzada** por ACTA y establecimiento
- ✅ **Validaciones** de formularios y datos
- ✅ **Estadísticas** en tiempo real

---

## 🏫 **Base de Datos de Establecimientos**

### **� Información Completa:**
- **Tipo de Establecimiento** (Liceo, Escuela, Jardín)
- **RBD Oficial** con dígito verificador
- **Nombre Completo** del establecimiento
- **Cobertura Educativa** (niveles que atiende)
- **Ubicación** (Comuna y dirección exacta)
- **Contacto** (teléfono y email institucional)

### **🔢 Ejemplos de RBDs:**
- **97-3** - Instituto Comercial Baldomero Wolnitzky
- **111-2** - Escuela Gabriela Mistral
- **33015-9** - Jardín Infantil Carita de Sol
- **10917-7** - Liceo Bicentenario Juan Pablo II

---

## 🔔 **Sistema de Notificaciones**

### **📢 Para Administrador:**
- **Notificaciones en tiempo real** de nuevos registros
- **Badge numérico** con cantidad de solicitudes pendientes
- **Panel desplegable** con información detallada
- **Información de RBD** del establecimiento del solicitante
- **Tiempo transcurrido** desde la solicitud

### **⚡ Actualización Automática:**
- Refresco cada 30 segundos
- Actualización al cambiar de usuario
- Conteo en tiempo real

---

## 📝 **Proceso de Registro**

### **📋 Campos Obligatorios:**
1. **Usuario** - Nombre de usuario único
2. **Email Institucional** - Solo dominios @slepiquique.cl o @slepiqq.cl
3. **Contraseña** - Mínimo 6 caracteres
4. **Establecimiento** - Selección de los 39 establecimientos
5. **Cargo/Función** - Rol específico en el establecimiento

### **� Cargos Disponibles:**
- **Directivos:** Director/a, Subdirector/a, Inspector/a General
- **Coordinadores:** Académico, PIE, SEP
- **Docentes:** Profesor/a Jefe, de Asignatura, Diferencial
- **Profesionales:** Psicólogo/a, Trabajador/a Social, Fonoaudiólogo/a
- **Asistentes:** De Aula, de Párvulos, Auxiliares
- **Personal SLEP:** Administrativo, Profesional, Directivo

---

## � **Seguridad Implementada**

### **🛡️ Medidas de Protección:**
- ✅ **Credenciales protegidas** - No hardcodeadas en el código
- ✅ **Validación de dominios** - Solo emails institucionales
- ✅ **Sistema de aprobación** - Control de acceso por administrador
- ✅ **Archivos sensibles** - Protegidos con .gitignore
- ✅ **Sesiones controladas** - Gestión de usuarios logueados

### **📜 Archivos Protegidos:**
---
## 🌐 **Acceso al Sistema**

### **🔗 URLs del Proyecto:**
- **Repositorio:** https://github.com/Panchlml7/slep-iquique-sistema
- **Sitio Web:** https://panchlml7.github.io/slep-iquique-sistema/

### **📱 Páginas Principales:**
- **Inicio:** `index.html` - Página principal con módulos
- **Login:** `login.html` - Sistema de autenticación
- **Registro:** `registrar.html` - Formulario de solicitud de cuenta
- **Administración:** `admin-usuarios.html` - Panel de gestión
- **Establecimientos:** `establecimiento.html` - Gestión de centros educativos

---

## 🛠️ **Tecnologías Utilizadas**

### **💻 Frontend:**
- **HTML5** - Estructura y semántica
- **CSS3** - Diseño responsive y moderno
- **JavaScript** - Funcionalidad e interactividad
- **LocalStorage** - Persistencia de datos local

### **🎨 Características Técnicas:**
- **Diseño Responsive** - Compatible con móviles y tablets
- **Validaciones en tiempo real** - Formularios interactivos
- **Notificaciones visuales** - Alertas y confirmaciones
- **Interfaz intuitiva** - Navegación fácil y accesible

---

## 📊 **Estadísticas del Sistema**

### **📈 Métricas Principales:**
- **39 Establecimientos** educativos gestionados
- **3 Tipos** de establecimiento (Liceos, Escuelas, Jardines)
- **2 Comunas** cubiertas (Iquique y Alto Hospicio)
- **40+ Cargos** diferentes disponibles para registro
- **Sistema de RBDs** completo y actualizado

### **🔢 Distribución por Tipo:**
- **Liceos:** 25.6% (10 establecimientos)
- **Escuelas:** 46.2% (18 establecimientos)
- **Jardines:** 30.8% (12 establecimientos)

---

## 👨‍💼 **Contacto y Responsable**

### **📧 Administrador del Sistema:**
- **Cargo:** Monitoreo de Datos
- **Institución:** Servicio Local de Educación Pública de Iquique
- **Email:** francisco.ramos@slepiquique.cl
- **Responsabilidades:** 
  - Gestión y monitoreo de datos educativos
  - Administración del sistema
  - Aprobación de usuarios
  - Mantenimiento de información de establecimientos

---

## 🔄 **Historial de Actualizaciones**

### **🆕 Última Actualización:**
- **Fecha:** Diciembre 2024
- **Versión:** 2.0 - Sistema Completo
- **Cambios Principales:**
  - Sistema de autenticación con administrador
  - Panel de administración completo
  - Base de datos de 39 establecimientos
  - Sistema de notificaciones en tiempo real
  - Seguridad mejorada con credenciales protegidas
  - Registro con establecimiento y cargo
  - Sistema de documentos con múltiples versiones

---

## 📜 **Licencia y Uso**

### **⚖️ Condiciones:**
- **Uso exclusivo** del Servicio Local de Educación Pública de Iquique
- **Datos oficiales** de establecimientos educativos
- **Sistema confidencial** para uso interno
- **Prohibida la redistribución** sin autorización

---

*Sistema desarrollado para el **Servicio Local de Educación Pública de Iquique** - Monitoreo de Datos y Gestión Educativa 📊*