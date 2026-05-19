# Producto 4 - FP067 - Notificaciones Push

**Integrantes:** Leonardo Cuevas, Gerard Garro, Christian García

🔗 **App Web desplegada:** https://fp067-producto4.onrender.com/  
📦 **Repositorio:** https://github.com/leonardojpeg/fp067-producto4

## Ejecutar

```bash
# Angular (web)
npm install
npm start
# → http://localhost:4200

# React Native (móvil)
cd app-mobile
npm install
npx expo start

# Cloud Functions (deploy)
cd functions
npm install
cd ..
firebase deploy --only functions
```

## Arquitectura

```
Angular app (Render) → escribe en Realtime Database
                              ↓
              Cloud Function (onCreate / onUpdate)
                              ↓
              FCM → topic 'all'
                    ↓              ↓
          React Native        Angular (SW)
```

## Estructura

```
├── functions/                      # Cloud Functions
│   ├── index.js                    # onCreate + onUpdate → push
│   └── package.json
├── app-mobile/                     # React Native
│   ├── App.js                      # FCM: permisos + token + listeners
│   ├── android/app/
│   │   ├── google-services.json
│   │   └── src/main/AndroidManifest.xml
│   ├── screens/
│   └── firebaseConfig.js
├── src/                            # Angular
│   ├── app/
│   │   ├── services/
│   │   │   ├── player.service.ts        # CRUD Realtime Database
│   │   │   └── notification.service.ts  # FCM web + VAPID
│   │   ├── app.ts                       # ngOnInit → notifications
│   │   └── app.config.ts               # provideDatabase + provideMessaging
│   ├── firebase-messaging-sw.js         # Background notifications
│   └── environments/environment.ts
├── firebase.json
├── .firebaserc
└── realtime-db-import.json              # 12 jugadores para importar
```

## Criterios de la Rúbrica

| Criterio | Puntos | Implementación |
|----------|--------|----------------|
| Cloud Functions (onCreate + onUpdate) | 5 | `functions/index.js` — triggers en `/players/{playerId}` → `sendToTopic('all')` |
| Notificación app móvil | 5 | `App.js` — permisos, token, topic, foreground/background listeners |
| Notificación app web | 5 | `notification.service.ts` + `firebase-messaging-sw.js` + VAPID key |

## Bibliografía

- https://rnfirebase.io/messaging/usage
- https://firebase.google.com/docs/functions/get-started
- https://firebase.google.com/docs/functions/database-events
- https://firebase.google.com/docs/cloud-messaging/js/client
- https://firebase.google.com/docs/cloud-messaging/concept-options#topic-messaging
