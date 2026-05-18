// Service Worker para recibir notificaciones push en background
// Este archivo se ejecuta independientemente de la app Angular

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// Configuración Firebase (misma que en environment.ts)
firebase.initializeApp({
  apiKey: "AIzaSyDoc2bs2EEFlpC1qxOaqpP28zif45NoBrw",
  authDomain: "fp067-producto2-basket.firebaseapp.com",
  projectId: "fp067-producto2-basket",
  storageBucket: "fp067-producto2-basket.firebasestorage.app",
  messagingSenderId: "476361573021",
  appId: "1:476361573021:web:8a5579909e6494d1cc4a74"
});

const messaging = firebase.messaging();

// Manejo de notificaciones recibidas en background
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Notificación recibida en background:', payload);

  const { title, body } = payload.notification || {};

  const notificationOptions = {
    body: body || 'Tienes una nueva notificación',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data
  };

  self.registration.showNotification(
    title || 'Notificación',
    notificationOptions
  );
});
