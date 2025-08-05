// SCRIPT LIMPIO PARA PESTAÑAS - admin-tabs.js

// Variable global para el tab actual
let currentTab = 'pendiente';

// Función principal para cambiar pestañas
function switchTab(status, buttonElement) {
    try {
        console.log('🔄 Ejecutando switchTab con status:', status);
        
        // Debug: verificar que recibimos los parámetros
        if (!status) {
            console.error('❌ Error: status es undefined');
            alert('Error: status no definido');
            return;
        }
        
        if (!buttonElement) {
            console.error('❌ Error: buttonElement es undefined');
            alert('Error: buttonElement no definido');
            return;
        }
        
        // Mostrar alert de confirmación
        alert('✅ Función switchTab ejecutándose correctamente para: ' + status);
        
        // Actualizar variable global
        currentTab = status;
        console.log('📝 currentTab actualizado a:', currentTab);
        
        // Remover clase active de todos los botones
        const allButtons = document.querySelectorAll('.tab-btn');
        console.log('🔍 Encontrados', allButtons.length, 'botones');
        
        allButtons.forEach(btn => {
            btn.classList.remove('active');
            console.log('🔲 Removida clase active de botón');
        });
        
        // Agregar clase active al botón clickeado
        buttonElement.classList.add('active');
        console.log('✅ Clase active agregada al botón clickeado');
        
        // Verificar si existe la función loadUsers
        if (typeof loadUsers === 'function') {
            console.log('📊 Llamando a loadUsers con status:', status);
            loadUsers(status);
        } else {
            console.warn('⚠️ Función loadUsers no encontrada');
            // Mostrar contenido simple para testing
            const tableBody = document.getElementById('usersTableBody');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
                            🔍 Mostrando datos para: <strong>${status}</strong>
                            <br><small>Función loadUsers no disponible - modo testing</small>
                        </td>
                    </tr>
                `;
            }
        }
        
        console.log('✅ switchTab completado exitosamente');
        
    } catch (error) {
        console.error('❌ Error en switchTab:', error);
        alert('Error en switchTab: ' + error.message);
    }
}

// Función de inicialización
function initializeTabs() {
    console.log('🚀 Inicializando sistema de pestañas...');
    
    // Verificar que existen los botones
    const buttons = document.querySelectorAll('.tab-btn');
    console.log('🔍 Botones encontrados:', buttons.length);
    
    if (buttons.length === 0) {
        console.error('❌ No se encontraron botones .tab-btn');
        return;
    }
    
    // Verificar que el primer botón tiene la clase active
    const firstButton = buttons[0];
    if (firstButton && !firstButton.classList.contains('active')) {
        firstButton.classList.add('active');
        console.log('✅ Clase active agregada al primer botón');
    }
    
    console.log('✅ Sistema de pestañas inicializado');
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado - inicializando pestañas');
    setTimeout(initializeTabs, 100); // Pequeño delay para asegurar que todo esté cargado
});

// Función simple para testing sin dependencias
function testTabFunction() {
    alert('🧪 Función de testing ejecutada correctamente');
    console.log('🧪 Test function ejecutada');
}
