# 🏛️ Sistema de Gestión SLEP Iquique

Sistema web para la gestión de documentos de acompañamiento pedagógico del Servicio Local de Educación Pública (SLEP) de Iquique.

## 📋 Características

- **🔐 Sistema de autenticación** con emails institucionales
- **📊 Dashboard** con estadísticas y reportes
- **🏫 Gestión de establecimientos** (Jardines, Escuelas, Liceos)
- **📄 Gestión de documentos** pedagógicos
- **📱 Diseño responsive** para móviles y escritorio

## 🏗️ Estructura del Proyecto

```
project_01/
├── index.html              # Página principal
├── login.html              # Inicio de sesión
├── registrar.html          # Registro de usuarios
├── dashboard.html          # Panel de control
├── establecimiento.html    # Gestión de establecimientos
├── css/
│   ├── estilo.css          # Estilos principales
│   ├── auth.css            # Estilos de autenticación
│   └── documentos.css      # Estilos de documentos
├── js/
│   ├── login.js            # Lógica de autenticación
│   ├── dashboard.js        # Funciones del dashboard
│   └── resigtrar.js        # Lógica de registro
└── documentos/             # Páginas de documentos
    ├── documento1.html
    ├── documento2.html
    └── ...
```

## 🚀 Instalación y Uso

1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. O ejecuta un servidor local:
   ```bash
   python -m http.server 5500
   ```

## 👥 Usuarios de Prueba

El sistema incluye usuarios predefinidos para pruebas (solo para desarrollo).

## 🏫 Establecimientos Incluidos

- **12 Jardines Infantiles** en Alto Hospicio
- **17 Escuelas Básicas** en Iquique y Alto Hospicio  
- **10 Liceos** técnicos y científico-humanistas

## 📧 Dominios Institucionales

- `@slepiquique.cl` - Personal SLEP Iquique
- `@slepiqq.cl` - Personal SLEP Iquique (abreviado)

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura
- **CSS3** - Estilos y diseño responsive
- **JavaScript** - Funcionalidad interactiva
- **LocalStorage** - Persistencia de datos

## 📄 Licencia

Este proyecto es desarrollado para el SLEP Iquique.

---
*Desarrollado con ❤️ para la educación pública de Iquique*
