importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAE4jlJ2cpc1JeQTikfxRkP7Wl6MJHeitY",
  authDomain: "fp067-producto3-basket.firebaseapp.com",
  databaseURL: "https://fp067-producto3-basket-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fp067-producto3-basket",
  storageBucket: "fp067-producto3-basket.firebasestorage.app",
  messagingSenderId: "992526713114",
  appId: "1:992526713114:web:7ca7804508f0b9b868aca3"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Notificación recibida en segundo plano: ', payload);
  
  const notificationTitle = payload.notification.title || "¡Actualización en el equipo!";
  const notificationOptions = {
    body: payload.notification.body || "Los datos de un jugador han sido actualizados."
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});