import { auth, db, Timestamp } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

// Función para registrar usuario y guardar datos en Firestore
export async function registerUser(email, password, nombre) {
  try {
    // Crea el usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guarda datos adicionales en Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      nombre: nombre,
      email: email,
      creadoEn: Timestamp.now() // Fecha/hora de registro
    });

    return { success: true, uid: user.uid };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
