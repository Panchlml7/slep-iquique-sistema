# 📁 Carpeta de Documentos - SLEP Iquique

## Descripción
Esta carpeta contiene todos los archivos relacionados con el sistema de gestión de documentos de acompañamiento pedagógico.

## Archivos

### 🎯 **Archivo Principal**
- **`documentos.html`** - Versión principal del sistema de documentos (RECOMENDADO)

### 📄 **Otras Versiones**
- **`documentos_final.html`** - Versión alternativa con diseño mejorado
- **`documentos_new.html`** - Versión de desarrollo
- **`documentos_backup.html`** - Respaldo de versión anterior

## ✨ Características del Sistema

### 🔐 **Funcionalidades de Autenticación**
- Sistema de login integrado
- Protección de rutas
- Gestión de sesiones con localStorage

### 📋 **Gestión de Documentos**
- ✅ Formularios en pestañas para datos básicos y desarrollo de visita
- ✅ Número de acta automático y continuo por año
- ✅ Campo de establecimiento como combobox con lista de colegios
- ✅ RBD automático para establecimientos conocidos
- ✅ Validaciones completas de formularios
- ✅ Búsqueda por número de acta/folio
- ✅ Guardado en localStorage (sin base de datos)

### 🏫 **Establecimientos Incluidos**
El sistema incluye 25+ establecimientos de Iquique con sus RBDs correspondientes:
- Escuela Básica República de Francia
- Liceo Técnico Profesional Diego Portales
- Colegio San Luis Gonzaga
- Y muchos más...

### 🎨 **Diseño y UX**
- Diseño moderno y responsivo
- Navegación intuitiva por pestañas
- Estadísticas en tiempo real
- Interfaz amigable para dispositivos móviles

## 🔧 **Archivos de Dependencias**
Los archivos requieren las siguientes dependencias desde la carpeta raíz:

### CSS
- `../css/estilo.css` - Estilos principales del sistema
- `../css/documentos.css` - **NUEVO**: Estilos específicos para documentos

### JavaScript
- `../js/login.js` - Funcionalidades de autenticación
- `../js/documentos-html.js` - Lógica principal de documentos

## 📁 **Nueva Organización CSS**

### ✅ **Beneficios de la Separación**
- **🧹 Código más limpio**: HTML sin bloques `<style>` largos
- **♻️ Reutilización**: CSS compartido entre archivos
- **📦 Mantenimiento**: Un solo lugar para modificar estilos
- **⚡ Performance**: Mejor caching del navegador
- **🔍 Legibilidad**: Estructura más organizada

### 📄 **Contenido de `documentos.css`**
```css
/* Pestañas principales y sub-pestañas */
.main-tabs-navigation, .form-tabs-navigation

/* Formularios y validaciones */
.form-row, .form-group, .nav-btn

/* Documentos guardados */
.documents-section, .document-card

/* Estadísticas */
.stats-section, .stat-box

/* Responsive design */
@media queries completos

/* Estilos adicionales para documentos_new */
.file-upload-area, .doc-type, .filter-btn
```

## 🚀 **Uso**
1. Navegar desde `../index.html` 
2. Hacer clic en "Documentos"
3. Iniciar sesión si es necesario
4. Comenzar a gestionar documentos

## 📝 **Notas de Desarrollo**
- ✅ Todos los archivos HTML actualizados para usar CSS externo
- ✅ Rutas correctamente configuradas para subcarpeta
- ✅ Estilos consolidados en archivo separado
- ✅ Sistema funciona completamente sin base de datos
- ✅ Compatibilidad mantenida con todas las versiones

## 🔄 **Cambios Recientes**
- **📁 Organización**: Archivos HTML movidos a carpeta `documentos/`
- **🎨 CSS**: Estilos extraídos a `../css/documentos.css`
- **🔗 Referencias**: Todas las rutas actualizadas correctamente
- **📚 Documentación**: README completo con nueva estructura

---
*Última actualización: 11 de julio de 2025*
