# SLEP Iquique - Sistema de Gestión Educativa

## 📋 **Descripción del Proyecto**

Este proyecto es un sistema integral de gestión educativa diseñado para el Servicio Local de Educación Pública de Iquique. Proporciona funcionalidades para la gestión de usuarios, control de asistencia, y administración de establecimientos educativos, entre otros.

## 🚀 **Estructura del Proyecto**

El proyecto está organizado en dos principales directorios: `public` y `server`.

### **1. Directorio `public`**

Contiene todos los archivos estáticos que se sirven al cliente, incluyendo HTML, CSS y JavaScript.

- **index.html**: Página principal del sistema.
- **login.html**: Interfaz de inicio de sesión.
- **registrar.html**: Formulario de registro de nuevos usuarios.
- **admin-usuarios.html**: Panel administrativo para la gestión de usuarios.
- **asistencia.html**: Control de asistencia de usuarios.
- **establecimiento.html**: Gestión de información de establecimientos educativos.
- **css/**: Carpeta que contiene todos los archivos CSS.
- **js/**: Carpeta que contiene todos los archivos JavaScript.
- **documentos/**: Sistema documental para la gestión de documentos.

### **2. Directorio `server`**

Contiene la lógica del servidor, incluyendo la configuración de rutas y la conexión a la base de datos.

- **app.js**: Punto de entrada del servidor.
- **routes/**: Carpeta que contiene las rutas del servidor.
  - **auth.js**: Rutas relacionadas con la autenticación.
  - **users.js**: Rutas para la administración de usuarios.
  - **admin.js**: Rutas para funciones administrativas.
- **models/**: Carpeta que contiene los modelos de datos.
  - **database.js**: Conexión a la base de datos.
- **middleware/**: Carpeta que contiene middleware para la autenticación.

## 🛠️ **Tecnologías Utilizadas**

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **Base de Datos**: [Especificar base de datos utilizada, por ejemplo, MongoDB, MySQL, etc.]

## 📈 **Instrucciones de Uso**

1. **Instalación de Dependencias**:
   Ejecutar el siguiente comando en la raíz del proyecto:
   ```
   npm install
   ```

2. **Iniciar el Servidor**:
   Para iniciar el servidor, ejecutar:
   ```
   node server.js
   ```

3. **Acceso al Sistema**:
   Abrir un navegador y acceder a:
   ```
   http://localhost:3000
   ```

## 📞 **Soporte Técnico**

Para cualquier consulta o soporte técnico, por favor contactar a [tu correo electrónico o información de contacto].

## 🎉 **Conclusión**

Este sistema está diseñado para facilitar la gestión educativa en Iquique, proporcionando herramientas eficientes para la administración de usuarios y recursos educativos. Agradecemos a todos los colaboradores que hicieron posible este proyecto.