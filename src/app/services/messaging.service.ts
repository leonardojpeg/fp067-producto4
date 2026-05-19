import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { isSupported } from 'firebase/messaging';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private messaging: Messaging) {
    this.inicializarNotificaciones();
  }

  async inicializarNotificaciones() {
    const soportaMessaging = await isSupported();
    
    if (!soportaMessaging) {
      console.log('Este navegador no soporta notificaciones push.');
      return;
    }

    console.log('Firebase Messaging está listo en este navegador.');
    this.solicitarPermisos();
    this.escucharMensajesEnPrimerPlano();
  }

  solicitarPermisos() {
    getToken(this.messaging, { vapidKey: environment.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          console.log('Token de dispositivo obtenido con éxito:', currentToken);
        } else {
          console.log('No se pudo obtener el token. Asegúrate de dar permisos.');
        }
      })
      .catch((err) => {
        console.error('Error al recuperar el token de Firebase:', err);
      });
  }

  escucharMensajesEnPrimerPlano() {
    onMessage(this.messaging, {
      next: (payload) => {
        console.log('¡Mensaje recibido en primer plano (foreground)!', payload);
        alert(`Nueva notificación: ${payload.notification?.title}\n${payload.notification?.body}`);
      },
      error: (err) => console.error('Error al escuchar mensajes en primer plano:', err),
      complete: () => console.log('Escucha de mensajes completada.')
    });
  }
}