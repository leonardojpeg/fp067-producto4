import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private messaging: Messaging) {}

  solicitarPermisos() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('🏀 Permiso concedido para las notificaciones de los Lakers.');
        this.obtenerTokenDispositivo();
      } else {
        console.warn('El usuario ha rechazado las notificaciones.');
      }
    });
  }

  private obtenerTokenDispositivo() {
    getToken(this.messaging, { vapidKey: 'BHtIuR4Lc9J49EczhiPs7PxhoHYQuvWEQ73P4oFVwy0Spq4tsU118-PrvPhUM-g1k6EokKPL4lSEvi62U8awqRw' })
      .then((currentToken) => {
        if (currentToken) {
          console.log('Token Web de este PC:', currentToken);
        } else {
          console.log('No se ha podido generar el token de inscripción.');
        }
      }).catch((err) => {
        console.error('Error al recuperar el token de red:', err);
      });
  }

  escucharMensajesEnPrimerPlano() {
    onMessage(this.messaging, (payload) => {
      console.log('¡Mensaje interceptado en primer plano!', payload);
      alert(`[NOTIFICACIÓN LAKERS] ${payload.notification?.title}: ${payload.notification?.body}`);
    });
  }
}