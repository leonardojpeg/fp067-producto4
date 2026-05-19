import { Injectable, inject } from '@angular/core';
import { Messaging } from '@angular/fire/messaging';
import { getToken, onMessage } from 'firebase/messaging';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messaging = inject(Messaging);

  // URL de la Cloud Function para suscribir al topic
  private subscribeUrl = 'https://us-central1-fp067-producto2-basket.cloudfunctions.net/subscribeToTopic';

  /**
   * Solicita permisos de notificación al navegador y obtiene el token FCM.
   * Luego suscribe el token al topic 'all' via Cloud Function.
   */
  async requestPermission(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Permiso de notificación denegado por el usuario');
        return null;
      }

      // Esperar a que el Service Worker esté activo
      const registration = await navigator.serviceWorker.ready;

      const token = await getToken(this.messaging, {
        vapidKey: 'BLGLmjW9OBod_uecLCLjehq1_7yamfe5pZUvpJeyjFXPK5rNsazdtsRwWpZpCwWSJtYg7GLloOPM-vtmiwcEVpE',
        serviceWorkerRegistration: registration
      });

      console.log('FCM Token (web):', token);

      // Suscribir el token al topic 'all' via Cloud Function
      await this.subscribeTokenToTopic(token);

      return token;
    } catch (error) {
      console.error('Error al obtener token FCM:', error);
      return null;
    }
  }

  /**
   * Suscribe el token FCM al topic 'all' llamando a la Cloud Function
   */
  private async subscribeTokenToTopic(token: string): Promise<void> {
    try {
      const response = await fetch(this.subscribeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await response.json();
      console.log('Suscrito al topic "all":', data);
    } catch (error) {
      console.error('Error suscribiendo al topic:', error);
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
