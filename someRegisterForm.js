import { registerUser } from "./registerUser";

// ...existing code...

async function handleRegister(email, password, nombre) {
  const result = await registerUser(email, password, nombre);
  if (result.success) {
    // Registro exitoso
    // ...acciones después del registro...
  } else {
    // Mostrar error
    // ...manejo de errores...
  }
}

// ...existing code...