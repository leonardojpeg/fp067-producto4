import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Usando el proyecto Firebase de Producto 2 (fp067-producto2-basket)
const firebaseConfig = {
  apiKey: "AIzaSyDoc2bs2EEFlpC1qxOaqpP28zif45NoBrw",
  authDomain: "fp067-producto2-basket.firebaseapp.com",
  databaseURL: "https://fp067-producto2-basket-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fp067-producto2-basket",
  storageBucket: "fp067-producto2-basket.firebasestorage.app",
  messagingSenderId: "476361573021",
  appId: "1:476361573021:web:8a5579909e6494d1cc4a74"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getDatabase(app);

export { app, db };
