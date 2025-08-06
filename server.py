#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🌐 SERVIDOR HTTP SIMPLE PARA SLEP IQUIQUE
Servidor para ejecutar el sistema sin problemas de CORS
Funciona en cualquier IP local o pública
"""

import http.server
import socketserver
import webbrowser
import socket
import os
import sys
from pathlib import Path

class SlipHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Manejador personalizado con headers CORS"""
    
    def end_headers(self):
        # Agregar headers CORS para evitar problemas
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Manejar peticiones OPTIONS para CORS"""
        self.send_response(200)
        self.end_headers()

def get_local_ip():
    """Obtener la IP local de la máquina"""
    try:
        # Conectar a una dirección externa para obtener la IP local
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except Exception:
        return "localhost"

def main():
    # Configuración del servidor
    PORT = 8080
    HOST = "0.0.0.0"  # Escuchar en todas las interfaces
    
    # Cambiar al directorio del proyecto
    os.chdir(Path(__file__).parent)
    
    # Crear el servidor
    with socketserver.TCPServer((HOST, PORT), SlipHTTPRequestHandler) as httpd:
        local_ip = get_local_ip()
        
        print("🌐 =====================================")
        print("🏛️  SERVIDOR SLEP IQUIQUE INICIADO")
        print("🌐 =====================================")
        print()
        print("📍 ACCESOS DISPONIBLES:")
        print(f"   🔗 Local:      http://localhost:{PORT}")
        print(f"   🔗 Red Local:  http://{local_ip}:{PORT}")
        print(f"   🔗 Todas IPs:  http://0.0.0.0:{PORT}")
        print()
        print("📁 PÁGINAS PRINCIPALES:")
        print(f"   🏠 Inicio:     http://{local_ip}:{PORT}/index.html")
        print(f"   🔐 Login:      http://{local_ip}:{PORT}/login.html")
        print(f"   👥 Admin:      http://{local_ip}:{PORT}/admin-usuarios.html")
        print(f"   📋 Docs:       http://{local_ip}:{PORT}/documentos/documentos.html")
        print()
        print("⚠️  IMPORTANTE:")
        print("   - Sin problemas de CORS")
        print("   - Funciona con cualquier IP")
        print("   - Accesible desde la red local")
        print("   - Presiona Ctrl+C para detener")
        print()
        print("🌐 =====================================")
        
        try:
            # Abrir automáticamente en el navegador
            webbrowser.open(f'http://{local_ip}:{PORT}/index.html')
            
            # Iniciar el servidor
            print("🚀 Servidor ejecutándose...")
            httpd.serve_forever()
            
        except KeyboardInterrupt:
            print("\n⏹️  Servidor detenido por el usuario")
            sys.exit(0)
        except Exception as e:
            print(f"❌ Error: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
