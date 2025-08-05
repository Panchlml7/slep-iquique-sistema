document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Sistema de registro iniciado');
    
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

function handleRegister(event) {
    event.preventDefault();
    console.log('📝 Procesando registro...');
    
    // Obtener datos del formulario
    const formData = new FormData(event.target);
    const userData = {
        nombre: formData.get('nombre').trim(),
        apellidoPaterno: formData.get('apellidoPaterno').trim(),
        apellidoMaterno: formData.get('apellidoMaterno').trim(),
        fechaNacimiento: formData.get('fechaNacimiento'),
        username: formData.get('username').trim().toLowerCase(),
        email: formData.get('email').trim().toLowerCase(),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        establecimiento: formData.get('establecimiento'),
        cargo: formData.get('cargo'),
        status: 'pendiente',
        registrationDate: new Date().toISOString()
    };
    
    // Validaciones
    const validation = validateUserData(userData);
    if (!validation.isValid) {
        alert('❌ ' + validation.message);
        return;
    }
    
    // Verificar si el usuario ya existe
    const existingUsers = JSON.parse(localStorage.getItem('appUsers') || '[]');
    const userExists = existingUsers.some(user => 
        user.username === userData.username || user.email === userData.email
    );
    
    if (userExists) {
        alert('❌ El usuario o email ya están registrados');
        return;
    }
    
    // Crear nombre completo
    userData.nombreCompleto = `${userData.nombre} ${userData.apellidoPaterno} ${userData.apellidoMaterno}`;
    
    // Remover confirmPassword antes de guardar
    delete userData.confirmPassword;
    
    // Guardar usuario
    existingUsers.push(userData);
    localStorage.setItem('appUsers', JSON.stringify(existingUsers));
    
    console.log('✅ Usuario registrado:', userData.username);
    
    // Mostrar mensaje de éxito
    alert(`✅ ¡Registro exitoso!

Tu cuenta ha sido creada con el usuario: ${userData.username}

Estado: Pendiente de aprobación por el administrador

Te contactaremos por email cuando tu cuenta sea aprobada.`);
    
    // Limpiar formulario
    document.getElementById('registerForm').reset();
    
    // Opcional: redirigir al login
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function validateUserData(userData) {
    // Validar campos requeridos
    const requiredFields = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'username', 'email', 'password', 'establecimiento', 'cargo'];
    
    for (let field of requiredFields) {
        if (!userData[field] || userData[field].trim() === '') {
            return {
                isValid: false,
                message: `El campo ${field} es requerido`
            };
        }
    }
    
    // Validar username
    if (userData.username.length < 3) {
        return {
            isValid: false,
            message: 'El usuario debe tener al menos 3 caracteres'
        };
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        return {
            isValid: false,
            message: 'El email no tiene un formato válido'
        };
    }
    
    // Validar contraseña
    if (userData.password.length < 6) {
        return {
            isValid: false,
            message: 'La contraseña debe tener al menos 6 caracteres'
        };
    }
    
    // Validar confirmación de contraseña
    if (userData.password !== userData.confirmPassword) {
        return {
            isValid: false,
            message: 'Las contraseñas no coinciden'
        };
    }
    
    // Validar fecha de nacimiento
    if (userData.fechaNacimiento) {
        const birthDate = new Date(userData.fechaNacimiento);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 18 || age > 80) {
            return {
                isValid: false,
                message: 'La edad debe estar entre 18 y 80 años'
            };
        }
    }
    
    return { isValid: true };
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        button.textContent = '🙈';
        button.title = 'Ocultar contraseña';
    } else {
        field.type = 'password';
        button.textContent = '👁️';
        button.title = 'Mostrar contraseña';
    }
}
