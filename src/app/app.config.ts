import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

import { environment } from '../environments/environment';
import { getApp } from 'firebase/app';

import { MessagingService } from './services/messaging.service';

export function inicializarMensajeria(messagingService: MessagingService) {
  return () => {
    messagingService.solicitarPermisos();
    messagingService.escucharMensajesEnPrimerPlano();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore(getApp(), 'basket')),

    provideMessaging(() => getMessaging()),

    {
      provide: APP_INITIALIZER,
      useFactory: inicializarMensajeria,
      deps: [MessagingService],
      multi: true
    }
  ]
};