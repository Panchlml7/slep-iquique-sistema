# 🛡️ SISTEMA DE PERMISOS Y ROLES - SLEP IQUIQUE

## 📋 **Resumen del Sistema Implementado**

Se ha implementado un sistema de **tres niveles de acceso** que controla quién puede acceder a qué páginas y funcionalidades.

---

## 👥 **NIVELES DE USUARIOS**

### 🔴 **1. SUPER ADMINISTRACIÓN (Francisco Ramos)**
- **Email:** `francisco.ramos@slepiquique.cl`
- **Contraseña:** `13Jul1993`
- **Status:** `super_admin`
- **Rol:** 👑 Super Administrador

**ACCESO COMPLETO:**
- ✅ **Todas las páginas públicas** (index.html, documentos, etc.)
- ✅ **Panel de Administración** (admin-usuarios.html)
- ✅ **Perfiles Autorizados** (perfiles-autorizados.html) - **EXCLUSIVO**
- ✅ **Promover usuarios a administradores**
- ✅ **Gestionar roles y permisos**

### 🟡 **2. ADMINISTRACIÓN NORMAL**
**Usuarios Ejemplo:**
- **María González:** `maria.gonzalez@slepiquique.cl` / `admin2024`
- **Admin Sistema:** `admin@slepiquique.cl` / `admin123`

**Status:** `admin`
**Rol:** ⚙️ Administrador

**ACCESO LIMITADO:**
- ✅ **Páginas públicas** (index.html, documentos, etc.)
- ✅ **Panel de Administración** (admin-usuarios.html)
- ❌ **Perfiles Autorizados** (perfiles-autorizados.html) - **PROHIBIDO**
- ❌ **Promover usuarios a administradores** - **PROHIBIDO**

### 🟢 **3. USUARIOS AUTORIZADOS**
**Status:** `aprobada`
**Rol:** ✅ Usuario Autorizado

**ACCESO BÁSICO:**
- ✅ **Páginas públicas** (index.html, documentos, asistencia, etc.)
- ❌ **Páginas de administración** - **PROHIBIDO**

---

## 🔒 **CONTROL DE ACCESO POR PÁGINAS**

### 📄 **Páginas Públicas** (Cualquier usuario logueado)
```
✅ index.html
✅ asistencia.html  
✅ establecimiento.html
✅ documentos.html
```

### ⚙️ **Páginas de Administración** (Admin + Super Admin)
```
🔐 admin-usuarios.html
🔐 registro.html
🔐 registrar.html
```

### 👑 **Páginas Exclusivas** (Solo Super Admin - Francisco)
```
🚫 perfiles-autorizados.html
🚫 admin-test.html
```

---

## 🚀 **FUNCIONES IMPLEMENTADAS**

### 🛡️ **Verificación de Permisos**
```javascript
// Verificar acceso a páginas específicas
checkPageAccess('admin-usuarios.html')

// Verificar roles específicos
isSuperAdmin()      // Solo Francisco
isAdmin()           // Admin normal + Super Admin
isNormalAdmin()     // Solo admin normal (NO super admin)

// Verificar permisos especiales
canManageAuthorizedProfiles()  // Solo Francisco
canPromoteToAdmin()            // Solo Francisco
```

### 📱 **Interfaz Adaptativa**
- **Botón "👑 Perfiles Autorizados"** solo visible para Francisco
- **Indicador de rol** en barra de navegación
- **Mensajes de acceso denegado** específicos por nivel

---

## 🧪 **PRUEBAS DEL SISTEMA**

### 📝 **Página de Test**: `test-simple.html`
Incluye todas las credenciales para probar los diferentes niveles:

**Super Admin:**
- francisco.ramos@slepiquique.cl / 13Jul1993

**Admin Normal:**
- maria.gonzalez@slepiquique.cl / admin2024
- admin@slepiquique.cl / admin123

### 🔍 **Escenarios de Prueba**

1. **Login como Francisco:**
   - ✅ Puede acceder a Perfiles Autorizados
   - ✅ Ve botón exclusivo en admin-usuarios.html
   - ✅ Acceso total al sistema

2. **Login como Admin Normal:**
   - ✅ Puede acceder a admin-usuarios.html
   - ❌ NO puede acceder a perfiles-autorizados.html
   - ❌ NO ve botón de Perfiles Autorizados

3. **Login como Usuario Normal:**
   - ✅ Puede acceder a páginas públicas
   - ❌ NO puede acceder a páginas de administración

---

## 💡 **CARACTERÍSTICAS ESPECIALES**

### 🔐 **Seguridad Multinivel**
- Verificación en tiempo real al cargar páginas
- Redirección automática si no tiene permisos
- Mensajes específicos según el tipo de acceso denegado

### 🎨 **Experiencia de Usuario**
- Indicadores visuales de rol en la interfaz
- Botones condicionales según permisos
- Mensajes informativos sobre limitaciones

### 🛠️ **Mantenibilidad**
- Sistema centralizado de permisos
- Fácil agregar nuevos usuarios o roles
- Configuración clara en `js/login.js`

---

## 📂 **ARCHIVOS MODIFICADOS**

1. **`js/login.js`** - Sistema de permisos y usuarios
2. **`admin-usuarios.html`** - Verificación de acceso
3. **`perfiles-autorizados.html`** - Acceso exclusivo Francisco
4. **`test-simple.html`** - Página de pruebas completa

---

## 🎯 **RESULTADO FINAL**

✅ **Francisco Ramos** = Acceso total como Super Administrador
✅ **Admins Normales** = Pueden usar admin-usuarios.html pero NO Perfiles Autorizados  
✅ **Usuarios Normales** = Solo páginas públicas
✅ **Sistema seguro** con verificaciones automáticas
✅ **Interfaz adaptativa** según nivel de permisos

**El sistema ahora diferencia claramente entre Super Administración y Administración Normal, cumpliendo exactamente con tu solicitud.**
