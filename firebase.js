import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFV21RxM-SCPxvpeoWBNToP9g9LAJToN8",
  authDomain: "diario-da-fisio.firebaseapp.com",
  projectId: "diario-da-fisio",
  storageBucket: "diario-da-fisio.firebasestorage.app",
  messagingSenderId: "899479182054",
  appId: "1:899479182054:web:f663c41394de5e0b8b3927",
  measurementId: "G-WK77D6LT28"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
