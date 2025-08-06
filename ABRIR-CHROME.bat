@echo off
title SLEP IQUIQUE - Abrir en Chrome
color 0A

echo.
echo ========================================
echo 🌐 SLEP IQUIQUE - ABRIR EN CHROME
echo ========================================
echo.

REM Verificar si el servidor está ejecutándose
echo 🔍 Verificando servidor...
timeout /t 2 /nobreak >nul

REM Abrir Chrome con la página de acceso
echo 🚀 Abriendo Chrome con SLEP Iquique...
start chrome "http://localhost:8080/acceso-chrome.html"

echo.
echo ✅ Chrome abierto con el sistema SLEP Iquique
echo.
echo 📋 CREDENCIALES PARA FRANCISCO:
echo    Usuario: francisco.ramos@slepiquique.cl
echo    Contraseña: 13Jul1993
echo.
echo 🔗 PÁGINAS PRINCIPALES:
echo    - Login: http://localhost:8080/login.html
echo    - Pruebas: http://localhost:8080/test-login.html
echo    - Admin: http://localhost:8080/admin-usuarios.html
echo.
echo 💡 Si hay problemas:
echo    1. Verificar que el servidor esté ejecutándose
echo    2. Usar modo incógnito en Chrome (Ctrl+Shift+N)
echo    3. Limpiar caché de Chrome (Ctrl+Shift+Delete)
echo.

pause
