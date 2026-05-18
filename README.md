# Producto 3 - FP067 - Interfaz Móvil con React Native

## Estructura del Proyecto

```
producto3-fp067/
├── app-mobile/                 # App React Native (Producto 3)
│   ├── App.js                  # Stack Navigator con 3 pantallas
│   ├── firebaseConfig.js       # Configuración Firebase Realtime DB
│   ├── screens/
│   │   ├── ListScreen.js       # FlatList con TODOS los datos de Firebase
│   │   ├── DetailScreen.js     # Detalle + zoom de imagen (Modal)
│   │   └── MediaScreen.js      # Reproductor con 6 botones de interacción
│   ├── package.json
│   ├── app.json
│   └── .gitignore
├── src/                        # App Angular (Producto 2 - base web)
│   ├── app/
│   │   ├── components/
│   │   │   ├── players/        # Listado + CRUD
│   │   │   ├── detail/         # Detalle con edición
│   │   │   └── media/          # Reproductor multimedia
│   │   ├── services/
│   │   ├── models/
│   │   └── pipes/
│   └── environments/
├── package.json                # Angular dependencies
├── angular.json
└── README.md
```

## App Móvil (React Native + Expo)

### Tecnologías
- React Native 0.81 + Expo SDK 54
- React Navigation (Stack Navigator)
- Firebase Realtime Database
- expo-av (reproductor multimedia)

### Pantallas
1. **ListScreen** - FlatList con todos los jugadores de Firebase, búsqueda y filtro por posición
2. **DetailScreen** - Todos los datos del jugador + imagen con zoom (Modal)
3. **MediaScreen** - Reproductor de vídeo con 6 controles: Play/Pause, Stop, Mute, Velocidad, Retroceder, Adelantar

### Navegación
- Stack Navigator con 3 pantallas
- Icono de vuelta atrás (automático con Stack)
- Botón "Inicio" en el header de Detail y Media

### Ejecutar
```bash
cd app-mobile
npm install
npx expo start
```

## App Web (Angular)

### Tecnologías
- Angular 17 (standalone components)
- @angular/fire (Firestore + Storage)
- Firebase Firestore (base de datos)
- Firebase Storage (imágenes y vídeos)

### Ejecutar
```bash
npm install
npm start
```

## Firebase
- Realtime Database: datos de jugadores para la app móvil
- Firestore: datos de jugadores para la app web (Producto 2)
- Storage: imágenes y vídeos subidos desde la app web

## Bibliografía
- React Native Docs: https://reactnative.dev/docs
- React Navigation: https://reactnavigation.org/docs
- Firebase JS SDK: https://firebase.google.com/docs/web/setup
- Expo AV: https://docs.expo.dev/versions/latest/sdk/av/
- Firebase Realtime Database: https://firebase.google.com/docs/database
