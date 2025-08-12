# 🚀 INSTALACIÓN Y EJECUCIÓN DEL SERVIDOR SLEP IQUIQUE

## 📋 Requisitos Previos
- Node.js versión 16 o superior
- npm versión 8 o superior
- Windows PowerShell (recomendado)

## ⚡ Instalación Rápida

### 1. Navegar al directorio del servidor (NUEVA UBICACIÓN REORGANIZADA)
```powershell
cd "c:\nosql\slep-iquique-sistema-main\web-server"
```

### 2. Instalar dependencias (si es necesario)
```powershell
npm install
```

### 3. Ejecutar servidor
```powershell
# Modo desarrollo (recomendado para pruebas)
npm run dev

# O modo producción
npm start

# O directamente con Node.js
node server.js
```

## 🌐 Acceso al Sistema

Una vez iniciado el servidor, verás mensajes como:
```
🚀 SERVIDOR SLEP IQUIQUE EJECUTÁNDOSE
📡 URL Local: http://localhost:3000
🌐 Red Local: http://192.168.1.XXX:3000
```

### Desde el mismo PC:
- Abrir navegador y ir a: `http://localhost:3000`

### Desde otros dispositivos (móvil, tablet, otra PC):
- Usar la IP de red mostrada en el terminal
- Ejemplo: `http://192.168.1.94:3000`
- Asegurarse que estén en la misma red WiFi

## 👥 Credenciales de Acceso

### Administrador Principal
- **Email:** `admin@slep.cl`
- **Contraseña:** `admin2024`
- **Rol:** Super Administrador

### Director de Establecimiento
- **Email:** `director@slep.cl`
- **Contraseña:** `director2024`
- **Rol:** Director

### Profesor
- **Email:** `profesor@slep.cl`
- **Contraseña:** `profesor2024`
- **Rol:** Profesor

## 🔧 Comandos Adicionales

```powershell
# Ver estado del sistema
curl http://localhost:3000/api/health

# Hacer backup de la base de datos
npm run backup-db

# Restaurar base de datos
npm run restore-db

# Ejecutar tests
npm test
```

## 📁 Nueva Estructura Reorganizada

```
📂 c:\nosql\slep-iquique-sistema-main\
├── 📂 web-server\                   (🆕 SERVIDOR WEB - Nueva ubicación)
│   ├── � server.js                 (Servidor principal)
│   ├── 📄 package.json              (Dependencias)
│   ├── 📂 server\                   (Backend)
│   │   ├── 📂 config\               (Configuraciones)
│   │   ├── 📂 models\               (Base de datos JSON)
│   │   └── 📂 routes\               (Rutas API)
│   ├── 📂 public\                   (Frontend)
│   └── 📂 node_modules\             (Dependencias)
├── 📂 documentos\                   (Sistema de documentos original)
├── 📂 css\                          (Estilos originales)
├── 📂 js\                           (Scripts originales)
└── 📄 *.html                        (Páginas originales)
```

## �📱 Acceso Multi-Dispositivo

El sistema ahora está disponible desde:
- ✅ PC (navegador local)
- ✅ Teléfono móvil (mismo WiFi)
- ✅ Tablet (mismo WiFi)
- ✅ Otra computadora (mismo WiFi)

## 🆕 Ventajas de la Reorganización

- ✅ **Todo integrado** en el proyecto principal
- ✅ **Estructura más limpia** y organizada
- ✅ **Fácil acceso** desde un solo directorio
- ✅ **Menos confusión** sobre ubicaciones
- ✅ **Mismo rendimiento** y funcionalidad

## 🚨 Solución de Problemas

### Error de puerto ocupado:
```powershell
# Buscar proceso usando el puerto
netstat -ano | findstr :3000
# Terminar proceso
taskkill /PID <numero_de_proceso> /F
```

### Problemas de permisos:
```powershell
# Ejecutar PowerShell como Administrador
# Permitir ejecución de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### No se puede acceder desde otros dispositivos:
- Verificar que el firewall de Windows permita el puerto 3000
- Comprobar que estén en la misma red WiFi
- Usar la IP correcta mostrada en el terminal

## 📞 Soporte

**Desarrollador:** Francisco Ramos  
**Email:** panchoramos39@gmail.com  
**GitHub:** https://github.com/panchlml7/slep-iquique-sistema

¡Sistema reorganizado y listo para uso multi-dispositivo! 🎉✨
