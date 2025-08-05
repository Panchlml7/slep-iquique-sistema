// Archivo para funciones específicas de registro
// Este archivo se mantiene por compatibilidad, pero la lógica principal está en login.js

// Función adicional para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función adicional para validar contraseña
function isValidPassword(password) {
    // Al menos 6 caracteres, una letra y un número
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordRegex.test(password);
}

// Función para validar nombres (solo letras y espacios)
function isValidName(name) {
    const nameRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
    return nameRegex.test(name.trim()) && name.trim().length > 0;
}

// Función para validar fecha de nacimiento
function isValidBirthDate(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    
    // Verificar que la fecha no sea futura
    if (birth > today) {
        return { valid: false, message: 'La fecha de nacimiento no puede ser futura' };
    }
    
    // Calcular edad
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    // Verificar que sea mayor de 18 años
    if (age < 18) {
        return { valid: false, message: 'Debes ser mayor de 18 años para registrarte' };
    }
    
    // Verificar que no sea mayor de 100 años (validación razonable)
    if (age > 100) {
        return { valid: false, message: 'Verifica la fecha de nacimiento ingresada' };
    }
    
    return { valid: true, age: age };
}

// Función para formatear nombres (capitalizar primera letra)
function formatName(name) {
    return name.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Función para generar ID único simple
function generateUserId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para validar dominio de email institucional
function isInstitutionalEmail(email) {
    const allowedDomains = ['@slepiquique.cl', '@slepiqq.cl'];
    return allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
}

// Función para crear objeto de usuario completo
function createUserObject(userData) {
    const {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        fechaNacimiento,
        username,
        email,
        password,
        establecimiento,
        cargo
    } = userData;
    
    return {
        id: generateUserId(),
        nombre: formatName(nombre),
        apellidoPaterno: formatName(apellidoPaterno),
        apellidoMaterno: formatName(apellidoMaterno),
        nombreCompleto: `${formatName(nombre)} ${formatName(apellidoPaterno)} ${formatName(apellidoMaterno)}`,
        fechaNacimiento,
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password,
        establecimiento,
        cargo,
        status: 'pendiente',
        registrationDate: new Date().toISOString(),
        lastActivity: new Date().toISOString()
    };
}

// Funciones auxiliares para el registro
window.registerHelpers = {
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidBirthDate,
    formatName,
    generateUserId,
    isInstitutionalEmail,
    createUserObject
};