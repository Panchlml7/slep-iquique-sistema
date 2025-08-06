# 🌐 GUÍA DE EJECUCIÓN - SLEP IQUIQUE SIN 127.0.0.1

## 🎯 **Problema Resuelto**
Has tenido problemas con `127.0.0.1` y errores al publicar. Ahora tienes un servidor que funciona con **cualquier IP** y **sin errores CORS**.

---

## 🚀 **OPCIÓN 1: Ejecutar con Un Click (RECOMENDADO)**

### ✅ **Método Súper Fácil:**
1. **Doble click** en el archivo: `INICIAR-SERVIDOR.bat`
2. El servidor se iniciará automáticamente
3. Se abrirá tu navegador con el sistema

### 📱 **Accesos Que Obtienes:**
- **Local:** `http://localhost:8080`
- **Red Local:** `http://TU_IP:8080`
- **Público:** `http://0.0.0.0:8080`

---

## 🚀 **OPCIÓN 2: Ejecutar Manual**

### 🔧 **Paso a Paso:**
```powershell
# 1. Abrir PowerShell en la carpeta del proyecto
cd "C:\nosql\slep-iquique-sistema-main"

# 2. Ejecutar el servidor
python server.py
```

---

## 🌐 **Ventajas del Nuevo Sistema**

### ✅ **Sin Problemas de CORS:**
- No más errores de `Access-Control-Allow-Origin`
- Carga archivos JavaScript sin problemas
- LocalStorage funciona perfectamente

### ✅ **Múltiples Formas de Acceso:**
- **Localhost:** Solo tu computadora
- **IP Local:** Cualquier dispositivo en tu red
- **IP Pública:** Si configuras port forwarding

### ✅ **Compatible con Publicación:**
- El código funciona igual en hosting
- No hay referencias a `127.0.0.1`
- Rutas relativas funcionan perfectamente

---

## 📋 **Páginas Principales**

Una vez que el servidor esté corriendo:

| Página | URL | Descripción |
|--------|-----|-------------|
| 🏠 Inicio | `/index.html` | Página principal |
| 🔐 Login | `/login.html` | Sistema de autenticación |
| 👥 Admin | `/admin-usuarios.html` | Panel administrativo |
| 📋 Documentos | `/documentos/documentos.html` | Sistema documental |
| 👤 Registro | `/registrar.html` | Registro de usuarios |

---

## 🔧 **Configuración Avanzada**

### **Cambiar Puerto:**
Editar en `server.py` la línea:
```python
PORT = 8080  # Cambiar a otro puerto si necesitas
```

### **Solo Acceso Local:**
Cambiar en `server.py`:
```python
HOST = "localhost"  # Solo acceso desde tu PC
```

### **Acceso desde la Red:**
Mantener:
```python
HOST = "0.0.0.0"  # Acceso desde cualquier IP
```

---

## 🌍 **Para Publicar en Internet**

### **Hosting Web (GitHub Pages, Netlify, etc.):**
1. El código ya está listo para publicación
2. Solo sube los archivos HTML, CSS, JS
3. No incluyas `server.py` (solo para desarrollo)

### **Servidor Propio:**
1. Sube todos los archivos a tu servidor
2. Configurar Apache/Nginx para servir archivos estáticos
3. El sistema funcionará igual

---

## ⚠️ **Solución de Problemas**

### **Error: "Python no encontrado"**
```powershell
# Instalar Python desde: https://python.org
# Marcar "Add Python to PATH" durante instalación
```

### **Error: "Puerto ocupado"**
```powershell
# Cambiar puerto en server.py:
PORT = 8081  # o cualquier otro puerto libre
```

### **Error: "No se puede conectar desde otro dispositivo"**
```powershell
# Verificar que HOST = "0.0.0.0" en server.py
# Verificar firewall de Windows
```

---

## 🎉 **Resultado Final**

Con este sistema ya **NO tendrás problemas** con:
- ❌ Errores de CORS
- ❌ Problemas con `127.0.0.1`
- ❌ Archivos que no cargan
- ❌ LocalStorage que no funciona
- ❌ Errores al publicar

✅ **Todo funcionará perfectamente** tanto en desarrollo como en producción.

---

**🚀 ¡Simplemente ejecuta `INICIAR-SERVIDOR.bat` y listo!**
