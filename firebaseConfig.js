// ... (asegúrate de importar initializeApp)
import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Tu objeto de configuración completo
const firebaseConfig = {
  apiKey: "AIzaSyBnRKitQGBX0u8k4CO0TLlYxCJuMf7xzE", // Ejemplo de API Key
  authDomain: "ia-slep-iqq.firebaseapp.com",
  projectId: "ia-slep-iqq",
  storageBucket: "ia-slep-iqq.appspot.com",
  messagingSenderId: "528895424744",
  appId: "1:528895424744:web:abcdef1234567890abcdef" // Ejemplo de App ID
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore, Auth y Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage, Timestamp };
