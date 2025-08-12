@echo off
title SLEP IQUIQUE - Sistema de Gestion Educativa
color 0A
echo.
echo ===============================================
echo   🏛️ SISTEMA SLEP IQUIQUE - INICIADOR RAPIDO
echo ===============================================
echo.
echo 👨‍💻 Desarrollador: Francisco Ramos
echo 📧 Contacto: panchoramos39@gmail.com
echo 🔢 Version: 2.0.0
echo.
echo ===============================================
echo   🚀 INICIANDO SERVIDOR WEB...
echo ===============================================
echo.

cd /d "%~dp0"
cd web-server

echo ⚡ Matando procesos Node.js previos...
taskkill /F /IM node.exe >nul 2>&1

timeout /t 2 >nul

echo 🔄 Iniciando servidor...
echo.

start "SLEP IQUIQUE SERVER" cmd /k "node server.js"

timeout /t 3 >nul

echo.
echo ===============================================
echo   ✅ SERVIDOR INICIADO EXITOSAMENTE
echo ===============================================
echo.
echo 📡 URL Local: http://localhost:3000
echo 🌐 URL Red: http://192.168.1.94:3000
echo.
echo 📱 Acceso desde movil/tablet:
echo    http://192.168.1.94:3000
echo.
echo ===============================================
echo   🧪 PAGINAS DE PRUEBA DISPONIBLES:
echo ===============================================
echo.
echo 🏠 Principal: http://localhost:3000
echo 🔐 Login: http://localhost:3000/login.html
echo 📋 Documentos: http://localhost:3000/documentos/documentos.html
echo 👥 Admin: http://localhost:3000/admin-usuarios.html
echo 📊 Asistencia: http://localhost:3000/asistencia.html
echo 🧪 Pruebas: http://localhost:3000/test-botones.html
echo.
echo ===============================================

start http://localhost:3000

echo.
echo ✨ Abriendo navegador automaticamente...
echo.
echo Presiona cualquier tecla para continuar...
pause >nul
