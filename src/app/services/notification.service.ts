import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { getApp } from 'firebase/app';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messaging: Messaging | null = null;

  constructor(private firestore: Firestore) {
    try {
      const app = getApp();
      this.messaging = getMessaging(app);
    } catch (error) {
      console.error('Error inicializando Firebase Messaging:', error);
    }
  }

  /**
   * Solicita permisos de notificación al navegador y obtiene el token FCM.
   * El token se usa para identificar este dispositivo/navegador en Firebase.
   */
  async requestPermission(): Promise<string | null> {
    if (!this.messaging) {
      console.error('Firebase Messaging no inicializado');
      return null;
    }

    try {
      // Solicitar permiso del navegador
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Permiso de notificación denegado por el usuario');
        return null;
      }

      // Obtener token FCM (necesita VAPID key de Firebase Console)
      const token = await getToken(this.messaging, {
        vapidKey: 'BN7UkyRSYM_nEGzOU9K9Fyf3lU3SITo-cEeulfSPAXUYx6yoBDYrUAR7a183bNMDfPoy3cEUBg63OO9njN48H5k'
      });

      console.log('FCM Token (web):', token);

      // Guardar el token en Firestore en la colección fcm_tokens
      if (token) {
        const tokenDocRef = doc(this.firestore, `fcm_tokens/${token}`);
        await setDoc(tokenDocRef, {
          token: token,
          platform: 'web',
          createdAt: new Date().toISOString()
        });
        console.log('Token guardado en Firestore');
      }

      return token;
    } catch (error) {
      console.error('Error al obtener token FCM:', error);
      return null;
    }
  }

  /**
   * Listener para notificaciones recibidas cuando la app está en FOREGROUND.
   * Las notificaciones en background son manejadas por el Service Worker.
   */
  listenForMessages(callback: (payload: any) => void): void {
    if (!this.messaging) {
      console.error('Firebase Messaging no inicializado');
      return;
    }

    onMessage(this.messaging, (payload) => {
      console.log('Notificación recibida (foreground):', payload);
      callback(payload);
    });
  }
}
