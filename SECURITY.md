# 🔐 SISTEMA DE SEGURIDAD - SLEP IQUIQUE

## 📋 Información del Propietario
- **Propietario:** Francisco Ramos
- **Email:** panchoramos39@gmail.com  
- **Usuario GitHub:** panchlml7
- **Repositorio:** https://github.com/Panchlml7/slep-iquique-sistema

## 🛡️ Configuración de Seguridad

### 1. Repositorio Privado
Para hacer tu repositorio privado en GitHub:
1. Ve a: https://github.com/Panchlml7/slep-iquique-sistema/settings
2. Scroll hacia abajo hasta "Danger Zone"
3. Click en "Change repository visibility"
4. Selecciona "Make private"
5. Confirma escribiendo el nombre del repositorio

### 2. Contraseña Maestra del Proyecto
El sistema tiene una **contraseña maestra** que protege el acceso a páginas administrativas:

**Contraseña actual:** `francisco.ramos.slep2025`

#### Páginas Protegidas:
- ✅ Administración de Usuarios (`admin-usuarios.html`)
- ✅ Gestión de Establecimientos (`establecimiento.html`)  
- ✅ Gestión de Documentos (`documentos/documentos.html`)

#### Cambiar Contraseña Maestra:
1. Abrir archivo: `js/security.js`
2. Buscar línea: `const masterHash = btoa('francisco.ramos.slep2025' + 'SLEP_IQUIQUE_2025');`
3. Cambiar `francisco.ramos.slep2025` por tu nueva contraseña
4. Guardar y subir cambios a GitHub

### 3. Sistema de Autenticación por Niveles

#### Nivel 1: Login Normal
- **Usuario Admin:** francisco.ramos
- **Email:** francisco.ramos@slepiquique.cl  
- **Contraseña:** 13Jul1993

#### Nivel 2: Contraseña Maestra
- **Contraseña:** francisco.ramos.slep2025
- **Bloqueo:** 3 intentos fallidos = 15 minutos bloqueado
- **Sesión:** Se mantiene durante la sesión del navegador

## 🚨 Medidas de Seguridad Implementadas

### ✅ Protecciones Activas:
1. **Repositorio GitHub:** Puede hacerse privado
2. **Contraseña Maestra:** Protege páginas administrativas
3. **Autenticación de Doble Nivel:** Login + Contraseña maestra
4. **Bloqueo por Intentos:** 3 intentos = 15 min bloqueado
5. **Sesiones Temporales:** Se cierra al cerrar navegador
6. **Validación de Acceso:** Verificación automática en páginas sensibles

### 🔐 Archivos de Seguridad:
- `js/security.js` - Sistema de contraseña maestra
- `js/login.js` - Sistema de autenticación de usuarios
- Este `SECURITY.md` - Documentación de seguridad

## 📱 Cómo Funciona

### Para Usuario Normal:
1. Entra a `login.html`
2. Ingresa credenciales normales
3. Accede a funciones básicas

### Para Administrador:
1. Entra a `login.html` 
2. Ingresa credenciales de admin
3. **Al acceder a páginas administrativas:**
   - Se solicita contraseña maestra
   - Debe ingresar: `francisco.ramos.slep2025`
   - Obtiene acceso completo

## 🛠️ Mantenimiento de Seguridad

### Cambios Recomendados:
1. **Cambiar contraseña maestra cada 3 meses**
2. **Hacer repositorio privado inmediatamente**
3. **No compartir credenciales en código**
4. **Revisar logs de acceso regularmente**

### En Caso de Compromiso:
1. Cambiar contraseña maestra inmediatamente
2. Cambiar contraseña de admin
3. Revisar historial de GitHub
4. Considerar crear nuevo repositorio privado

## 📞 Contacto de Emergencia
Si hay problemas de seguridad:
- **Email:** panchoramos39@gmail.com
- **GitHub:** @panchlml7

---
**⚠️ IMPORTANTE:** Este archivo contiene información sensible. Manténlo seguro y no lo compartas.
