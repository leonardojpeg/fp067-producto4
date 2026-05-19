import 'zone.js';
import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

// Registrar Service Worker para notificaciones push en background
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registrado:', registration.scope);
    })
    .catch((error) => {
      console.error('Error registrando Service Worker:', error);
    });
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
