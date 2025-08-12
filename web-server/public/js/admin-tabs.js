// SCRIPT SIMPLE PARA PESTAÑAS ADMIN - Solo funcionalidad básica

// Variable global para el tab actual
let currentTab = 'pendiente';

// Función principal para cambiar pestañas (será sobrescrita por el HTML si existe)
function switchTab(status, buttonElement) {
    try {
        console.log('🔄 admin-tabs.js: switchTab ejecutado para:', status);
        
        // Esta función será sobrescrita por el HTML principal
        // Solo proporciona funcionalidad básica de respaldo
        
        currentTab = status;
        
        // Remover clase active de todos los botones
        const allButtons = document.querySelectorAll('.tab-btn');
        allButtons.forEach(btn => btn.classList.remove('active'));
        
        // Agregar clase active al botón clickeado
        if (buttonElement) {
            buttonElement.classList.add('active');
        }
        
        console.log('✅ admin-tabs.js: Pestaña básica cambiada a:', status);
        
    } catch (error) {
        console.error('❌ Error en admin-tabs.js switchTab:', error);
    }
}

// Función de inicialización básica
function initializeTabs() {
    console.log('� admin-tabs.js: Inicializando pestañas básicas...');
    
    const buttons = document.querySelectorAll('.tab-btn');
    console.log('🔍 admin-tabs.js: Botones encontrados:', buttons.length);
    
    if (buttons.length > 0) {
        const firstButton = buttons[0];
        if (firstButton && !firstButton.classList.contains('active')) {
            firstButton.classList.add('active');
        }
    }
    
    console.log('✅ admin-tabs.js: Inicialización básica completada');
}

// Función de testing para verificar funcionamiento
function testTabSystem() {
    const tabs = ['pendiente', 'aprobada', 'rechazada', 'todos'];
    
    console.log('🧪 Iniciando test del sistema de pestañas...');
    
    let currentIndex = 0;
    const interval = setInterval(() => {
        if (currentIndex < tabs.length) {
            const status = tabs[currentIndex];
            const button = document.getElementById('btn-' + status);
            console.log(`🔄 Testing pestaña ${currentIndex + 1}: ${status}`);
            
            // Usar la función global switchTab (que puede ser sobrescrita)
            if (window.switchTab) {
                window.switchTab(status, button);
            } else {
                switchTab(status, button);
            }
            
            currentIndex++;
        } else {
            clearInterval(interval);
            console.log('✅ Test de pestañas completado');
            // Volver a la primera pestaña
            const firstBtn = document.getElementById('btn-pendiente');
            if (window.switchTab) {
                window.switchTab('pendiente', firstBtn);
            } else {
                switchTab('pendiente', firstBtn);
            }
        }
    }, 1500);
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 admin-tabs.js: DOM cargado');
    setTimeout(() => {
        // Solo inicializar si no hay una función switchTab más específica
        if (!window.switchTab || window.switchTab === switchTab) {
            initializeTabs();
        } else {
            console.log('ℹ️ admin-tabs.js: Función switchTab ya sobrescrita, no inicializando');
        }
    }, 100);
});

// Exportar funciones para uso global (serán sobrescritas si es necesario)
if (!window.switchTab) {
    window.switchTab = switchTab;
}
window.testTabSystem = testTabSystem;
