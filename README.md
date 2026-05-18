# Producto 4 - FP067 - Recibiendo Notificaciones Push

## Arquitectura

```
Firebase Console (fp067-producto3-basket)
├── App Android (React Native)
├── App Web (Angular)
├── Cloud Functions
│   ├── onNewPlayer (onCreate) → envía FCM push
│   └── onUpdatePlayer (onUpdate) → envía FCM push
├── Cloud Messaging (FCM)
│   ├── → React Native (@react-native-firebase/messaging)
│   └── → Angular (firebase/messaging + Service Worker)
└── Realtime Database (datos de jugadores)
```

## Estructura del Proyecto

```
producto4-fp067/
├── functions/                      # Cloud Functions (Criterio 1)
│   ├── index.js                    # onCreate + onUpdate triggers
│   └── package.json
├── app-mobile/                     # App React Native (Criterio 2)
│   ├── App.js                      # Notificaciones FCM integradas
│   ├── screens/
│   │   ├── ListScreen.js
│   │   ├── DetailScreen.js
│   │   └── MediaScreen.js
│   ├── android/app/src/main/
│   │   └── AndroidManifest.xml     # Permisos POST_NOTIFICATIONS
│   ├── firebaseConfig.js
│   └── package.json                # @react-native-firebase deps
├── src/                            # App Angular (Criterio 3)
│   ├── app/
│   │   ├── services/
│   │   │   ├── player.service.ts
│   │   │   └── notification.service.ts  # Servicio FCM web
│   │   ├── app.ts                  # Integra NotificationService
│   │   └── app.config.ts           # provideMessaging()
│   ├── firebase-messaging-sw.js    # Service Worker background
│   └── environments/
├── firebase.json
├── .firebaserc
└── package.json
```

## Criterio 1: Cloud Functions (5 pts)

### Triggers implementados:
- **`onNewPlayer`** (onCreate): Se dispara cuando se añade un nuevo jugador a la BD. Envía push al topic 'all'.
- **`onUpdatePlayer`** (onUpdate): Se dispara cuando se modifica un jugador. Envía push al topic 'all'.

### Desplegar:
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## Criterio 2: Notificación en App Móvil - React Native (5 pts)

### Implementado en `app-mobile/App.js`:
1. Solicitud de permisos (Android 13+ POST_NOTIFICATIONS)
2. Obtención de token FCM
3. Suscripción al topic 'all'
4. Listener foreground (Alert.alert)
5. Handler background (setBackgroundMessageHandler)
6. Handler apertura desde notificación

### Configuración:
- `google-services.json` → colocar en `android/app/`
- Permisos en `AndroidManifest.xml`
- Dependencias: `@react-native-firebase/app` + `@react-native-firebase/messaging`

## Criterio 3: Notificación en App Web - Angular (5 pts)

### Implementado:
1. **`notification.service.ts`** — Solicita permisos, obtiene token, escucha mensajes foreground
2. **`firebase-messaging-sw.js`** — Service Worker para notificaciones background
3. **`app.ts`** — Integra el servicio en ngOnInit
4. **`app.config.ts`** — provideMessaging() registrado
5. **`angular.json`** — Service Worker incluido en assets del build

## Ejecutar

### Angular (web):
```bash
npm install
npm start
```

### React Native (móvil):
```bash
cd app-mobile
npm install
npx expo start
```

### Cloud Functions:
```bash
firebase deploy --only functions
```

## Bibliografía
- https://rnfirebase.io/messaging/usage
- https://firebase.google.com/docs/functions/get-started
- https://firebase.google.com/docs/functions/database-events
- https://firebase.google.com/docs/cloud-messaging/js/client
- https://firebase.google.com/docs/cloud-messaging/concept-options#topic-messaging
