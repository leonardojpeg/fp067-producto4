# Producto 4 - Recibiendo Notificaciones Push

## Guía para obtener la máxima puntuación (15/15)

---

## Resumen de la Rúbrica (3 criterios × 5 puntos)

| Criterio | Puntos | Requisito para máxima nota |
|----------|--------|---------------------------|
| **Cloud Functions (envío push)** | 5 | Push notification a Angular Y React Native en onCreate y onUpdate + documento con capturas, justificación y bibliografía |
| **Notificación en app móvil (React Native)** | 5 | App creada en Firebase + configuración móvil + permisos + código en app.js |
| **Notificación en app web (Angular)** | 5 | App creada en Firebase + configuración web + permisos + código incorporado |

**Nota**: Si no compila en CodeSandbox → -2 puntos

---

## Arquitectura General

```
Firebase Console
├── Proyecto Android (React Native)
├── Proyecto Web (Angular)
├── Cloud Functions
│   └── triggers: onWrite / onUpdate → envía FCM push
├── Cloud Messaging (FCM)
│   ├── → React Native (rnfirebase.io)
│   └── → Angular (firebase/messaging)
└── Realtime Database / Firestore
```

---

## 1. Cloud Functions - Envío de Push Notifications (5 puntos)

### Requisitos para máxima nota:
- Push a Angular Y React Native
- Triggers en onCreate y onUpdate
- Documento con capturas + justificación + bibliografía

### Inicializar Cloud Functions

```bash
# Instalar Firebase CLI
npm install -g firebase-tools
firebase login
firebase init functions
# Seleccionar: JavaScript, instalar dependencias
```

### Código de Cloud Functions

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Trigger: cuando se CREA un nuevo elemento en la BD
 * Envía notificación push a todos los dispositivos suscritos
 */
exports.onNewItem = functions.database
  .ref('/retos/{retoId}')
  .onCreate(async (snapshot, context) => {
    const newItem = snapshot.val();
    const payload = {
      notification: {
        title: '🆕 Nuevo reto disponible',
        body: `${newItem.titulo}: ${newItem.descripcion}`,
      },
      data: {
        itemId: context.params.retoId,
        type: 'new_item'
      }
    };

    // Enviar a topic 'all' (suscrito por Angular y React Native)
    return admin.messaging().sendToTopic('all', payload);
  });

/**
 * Trigger: cuando se ACTUALIZA un elemento en la BD
 * Envía notificación push informando del cambio
 */
exports.onUpdateItem = functions.database
  .ref('/retos/{retoId}')
  .onUpdate(async (change, context) => {
    const before = change.before.val();
    const after = change.after.val();

    const payload = {
      notification: {
        title: '🔄 Reto actualizado',
        body: `${after.titulo} ha sido modificado`,
      },
      data: {
        itemId: context.params.retoId,
        type: 'update_item',
        changes: JSON.stringify({ before: before.titulo, after: after.titulo })
      }
    };

    return admin.messaging().sendToTopic('all', payload);
  });
```

### Desplegar

```bash
firebase deploy --only functions
```

---

## 2. Notificación en App Móvil - React Native (5 puntos)

### Requisitos para máxima nota:
- App creada en Firebase Console para Android
- Configuración de la app móvil
- Permisos modificados
- Código en app.js para recibir notificaciones

### Paso 1: Crear app Android en Firebase Console

1. Firebase Console → Configuración del proyecto → Añadir app → Android
2. Nombre del paquete: `com.tuproyecto.producto4`
3. Descargar `google-services.json` → colocar en `android/app/`

### Paso 2: Instalar dependencias

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

### Paso 3: Configurar permisos Android

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest>
  <!-- Permiso para notificaciones (Android 13+) -->
  <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
  
  <application>
    <!-- Canal de notificaciones por defecto -->
    <meta-data
      android:name="com.google.firebase.messaging.default_notification_channel_id"
      android:value="default_channel" />
  </application>
</manifest>
```

### Paso 4: Código en App.js

```javascript
// App.js (añadir al código existente del producto 3)
import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform, PermissionsAndroid } from 'react-native';

export default function App() {
  
  useEffect(() => {
    setupNotifications();
  }, []);

  async function setupNotifications() {
    // 1. Solicitar permisos
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Permisos de notificación denegados');
      return;
    }

    // 2. Obtener token FCM del dispositivo
    const token = await messaging().getToken();
    console.log('FCM Token:', token);

    // 3. Suscribirse al topic 'all'
    await messaging().subscribeToTopic('all');
    console.log('Suscrito al topic "all"');

    // 4. Listener: notificación recibida en foreground
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body
      );
    });

    // 5. Listener: notificación recibida en background
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Mensaje en background:', remoteMessage);
    });

    // 6. Listener: app abierta desde notificación
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('App abierta desde notificación:', remoteMessage.data);
      // Navegar a la pantalla correspondiente
    });

    return unsubscribeForeground;
  }

  // ... resto del Stack Navigator del producto 3
}
```

---

## 3. Notificación en App Web - Angular (5 puntos)

### Requisitos para máxima nota:
- App creada en Firebase Console para Web
- Configuración de la app web
- Permisos del navegador
- Código incorporado

### Paso 1: Crear app Web en Firebase Console

1. Firebase Console → Configuración → Añadir app → Web
2. Copiar configuración (apiKey, etc.)

### Paso 2: Instalar dependencias

```bash
npm install firebase @angular/fire
```

### Paso 3: Service Worker para notificaciones en background

```javascript
// src/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
});

const messaging = firebase.messaging();

// Manejo de notificaciones en background
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/assets/icons/icon-128x128.png'
  });
});
```

### Paso 4: Servicio de notificaciones en Angular

```typescript
// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messaging;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.messaging = getMessaging(app);
  }

  /**
   * Solicita permisos y obtiene token FCM
   */
  async requestPermission(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Permiso de notificación denegado');
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey: 'TU_VAPID_KEY_DE_FIREBASE_CONSOLE'
      });
      console.log('FCM Token (web):', token);
      return token;
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  }

  /**
   * Listener para notificaciones en foreground
   */
  listenForMessages(callback: (payload: any) => void): void {
    onMessage(this.messaging, (payload) => {
      console.log('Notificación recibida (foreground):', payload);
      callback(payload);
    });
  }
}
```

### Paso 5: Integrar en componente Angular

```typescript
// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private notificationService: NotificationService) {}

  async ngOnInit() {
    // Solicitar permisos y obtener token
    await this.notificationService.requestPermission();

    // Escuchar notificaciones en foreground
    this.notificationService.listenForMessages((payload) => {
      // Mostrar notificación en la UI
      alert(`${payload.notification.title}: ${payload.notification.body}`);
    });
  }
}
```

### Paso 6: Registrar Service Worker en angular.json

```json
{
  "architect": {
    "build": {
      "options": {
        "assets": [
          "src/firebase-messaging-sw.js"
        ]
      }
    }
  }
}
```

---

## Dependencias adicionales

### React Native (añadir al package.json del producto 3)
```json
{
  "@react-native-firebase/app": "^18.7.3",
  "@react-native-firebase/messaging": "^18.7.3"
}
```

### Angular (añadir al package.json del producto 2)
```json
{
  "firebase": "^10.7.1",
  "@angular/fire": "^17.0.1"
}
```

### Cloud Functions
```json
{
  "firebase-admin": "^12.0.0",
  "firebase-functions": "^4.5.0"
}
```

---

## Documento de Entrega (para 5 puntos en criterio 1)

Incluir en el PDF/DOC:
1. **Capturas de pantalla**:
   - Firebase Console con las apps creadas (Android + Web)
   - Cloud Functions desplegadas
   - Notificación recibida en React Native
   - Notificación recibida en Angular (navegador)
   - Logs de Cloud Functions ejecutándose
2. **Justificación**: Explicar el flujo completo (BD cambia → trigger → FCM → dispositivos)
3. **Bibliografía**:
   - https://rnfirebase.io/messaging/usage
   - https://firebase.google.com/docs/functions/get-started
   - https://firebase.google.com/docs/functions/database-events
   - https://firebase.google.com/docs/cloud-messaging/js/client

---

## Checklist Final

- [ ] App Android creada en Firebase Console
- [ ] App Web creada en Firebase Console
- [ ] `google-services.json` en el proyecto React Native
- [ ] Permisos de notificación en AndroidManifest.xml
- [ ] Código de recepción de notificaciones en App.js (React Native)
- [ ] Suscripción a topic 'all' en React Native
- [ ] Service Worker `firebase-messaging-sw.js` en Angular
- [ ] Servicio de notificaciones en Angular con permisos del navegador
- [ ] Cloud Function `onCreate` desplegada y funcionando
- [ ] Cloud Function `onUpdate` desplegada y funcionando
- [ ] Push llega a React Native (foreground + background)
- [ ] Push llega a Angular (foreground + background)
- [ ] Proyecto en CodeSandbox compilando
- [ ] Documento con capturas + justificación + bibliografía
- [ ] Repositorio GitHub nuevo con .gitignore (node_modules)
