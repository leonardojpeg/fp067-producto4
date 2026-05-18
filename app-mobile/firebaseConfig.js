import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAFQKbBSAhnpMv2A5A8THGqhHZFmNXP6Z0",
  authDomain: "fp067-producto3-basket.firebaseapp.com",
  databaseURL: "https://fp067-producto3-basket-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fp067-producto3-basket",
  storageBucket: "fp067-producto3-basket.firebasestorage.app",
  messagingSenderId: "992526713114",
  appId: "1:992526713114:web:7ca7804508f0b9b868aca3"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getDatabase(app);

export { app, db };
