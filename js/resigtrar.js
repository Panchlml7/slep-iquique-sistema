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

// Función para generar ID único simple
function generateUserId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Funciones auxiliares para el registro
window.registerHelpers = {
    isValidEmail,
    isValidPassword,
    generateUserId
};