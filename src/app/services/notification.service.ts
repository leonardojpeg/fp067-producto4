import { Injectable, inject } from '@angular/core';
import { Messaging } from '@angular/fire/messaging';
import { getToken, onMessage } from 'firebase/messaging';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messaging = inject(Messaging);

  /**
   * Solicita permisos de notificación al navegador y obtiene el token FCM.
   */
  async requestPermission(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Permiso de notificación denegado por el usuario');
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey: 'BLGLmjW9OBod_uecLCLjehq1_7yamfe5pZUvpJeyjFXPK5rNsazdtsRwWpZpCwWSJtYg7GLloOPM-vtmiwcEVpE'
      });

      console.log('FCM Token (web):', token);
      return token;
    } catch (error) {
      console.error('Error al obtener token FCM:', error);
      return null;
    }
  }

  /**
   * Listener para notificaciones recibidas en FOREGROUND.
   */
  listenForMessages(callback: (payload: any) => void): void {
    onMessage(this.messaging, (payload) => {
      console.log('Notificación recibida (foreground):', payload);
      callback(payload);
    });
  }
}
