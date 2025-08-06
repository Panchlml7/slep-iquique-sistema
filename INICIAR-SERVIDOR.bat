@echo off
title SLEP IQUIQUE - Servidor Web
color 0A

echo.
echo ========================================
echo 🏛️  SLEP IQUIQUE - SERVIDOR WEB
echo ========================================
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python no está instalado o no está en PATH
    echo.
    echo 📋 INSTRUCCIONES:
    echo    1. Instalar Python desde: https://python.org
    echo    2. Asegurarse de marcar "Add to PATH"
    echo    3. Reiniciar esta ventana
    echo.
    pause
    exit /b 1
)

echo ✅ Python detectado correctamente
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

echo 🚀 Iniciando servidor SLEP IQUIQUE...
echo.

REM Ejecutar el servidor Python
python server.py

echo.
echo 🔄 El servidor se ha detenido
pause
