# Producto 3 - Interfaz Móvil con React Native

## Guía para obtener la máxima puntuación (35/35)

---

## Resumen de la Rúbrica (4 criterios)

| Criterio | Puntos | Requisito para máxima nota |
|----------|--------|---------------------------|
| **Ventana Listado + Firebase** | 6 | FlatList con TODOS los datos de Firebase + documento con capturas y justificación + bibliografía |
| **Navegabilidad** | 6 | Stack con 3 ventanas, navegación listado→detalle→multimedia, icono atrás + botón inicio |
| **Ventana Detalle + Firebase** | 6 | Todos los datos de Firebase + imagen con click para zoom |
| **Ventana Multimedia + Firebase** | 7 | Reproducción multimedia (URL desde Firebase) con mínimo 4 botones/zonas de interacción |

**Nota**: Si el proyecto no compila en CodeSandbox → -2 puntos

---

## Estructura del Proyecto

```
producto3-fp067/
├── App.js                    # Stack Navigator principal
├── src/
│   ├── screens/
│   │   ├── ListScreen.js     # Pantalla listado con FlatList
│   │   ├── DetailScreen.js   # Pantalla detalle con zoom
│   │   └── MediaScreen.js    # Pantalla multimedia (4+ botones)
│   ├── components/
│   │   ├── ListItem.js       # Item renderizado en FlatList
│   │   └── ImageZoom.js      # Componente imagen con zoom
│   └── config/
│       └── firebase.js       # Configuración Firebase
├── package.json
├── .gitignore                # node_modules incluido
└── README.md
```

---

## 1. Configuración Firebase (base para todo)

```javascript
// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, get };
```

---

## 2. Ventana Listado con FlatList + Firebase (6 puntos)

### Requisitos para máxima nota:
- FlatList que recoge TODOS los datos de Firebase
- Documento con capturas de pantalla y justificación
- Bibliografía incluida

```javascript
// src/screens/ListScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { database, ref, get } from '../config/firebase';

export default function ListScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Equivalente a componentDidMount con once()
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(database, 'retos'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const itemsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setItems(itemsArray);
        }
      } catch (error) {
        console.error('Error Firebase:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Detail', { item })}
    >
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.subtitle}>{item.descripcion}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Listado de Retos</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 18, fontWeight: '600' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  loader: { flex: 1, justifyContent: 'center' }
});
```

---

## 3. Navegabilidad entre ventanas (6 puntos)

### Requisitos para máxima nota:
- Stack con 3 ventanas (listado, detalle, multimedia)
- Navegación listado → detalle → multimedia
- Icono de vuelta atrás
- Botón de inicio en el menú

```javascript
// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import ListScreen from './src/screens/ListScreen';
import DetailScreen from './src/screens/DetailScreen';
import MediaScreen from './src/screens/MediaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="List"
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          // Botón de inicio en todas las pantallas
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('List')}>
              <Text style={{ color: '#fff', fontSize: 16 }}>🏠 Inicio</Text>
            </TouchableOpacity>
          )
        })}
      >
        <Stack.Screen
          name="List"
          component={ListScreen}
          options={{ title: 'Listado', headerRight: () => null }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Detalle' }}
        />
        <Stack.Screen
          name="Media"
          component={MediaScreen}
          options={{ title: 'Multimedia' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## 4. Ventana Detalle + Firebase + Zoom en imagen (6 puntos)

### Requisitos para máxima nota:
- Todos los datos de Firebase mostrados
- Imagen con click para verla con más zoom (EXTRA obligatorio para 6 puntos)

```javascript
// src/screens/DetailScreen.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, ScrollView, Button } from 'react-native';

export default function DetailScreen({ route, navigation }) {
  const { item } = route.params;
  const [zoomVisible, setZoomVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Imagen con click para zoom */}
      <TouchableOpacity onPress={() => setZoomVisible(true)}>
        <Image source={{ uri: item.imagen }} style={styles.image} />
        <Text style={styles.zoomHint}>Toca para ampliar</Text>
      </TouchableOpacity>

      {/* Todos los datos de Firebase */}
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.description}>{item.descripcion}</Text>
      <Text style={styles.info}>Categoría: {item.categoria}</Text>
      <Text style={styles.info}>Fecha: {item.fecha}</Text>
      <Text style={styles.info}>Dificultad: {item.dificultad}</Text>

      {/* Botón para ir a multimedia */}
      <Button
        title="Ver Multimedia"
        onPress={() => navigation.navigate('Media', { item })}
        color="#6200ee"
      />

      {/* Modal de zoom */}
      <Modal visible={zoomVisible} transparent={true} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setZoomVisible(false)}
        >
          <Image
            source={{ uri: item.imagen }}
            style={styles.zoomedImage}
            resizeMode="contain"
          />
          <Text style={styles.closeText}>Toca para cerrar</Text>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  image: { width: '100%', height: 200, borderRadius: 8 },
  zoomHint: { textAlign: 'center', color: '#6200ee', marginTop: 4, fontSize: 12 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  description: { fontSize: 16, color: '#333', marginTop: 8 },
  info: { fontSize: 14, color: '#666', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  zoomedImage: { width: '95%', height: '80%' },
  closeText: { color: '#fff', marginTop: 16, fontSize: 16 }
});
```

---

## 5. Ventana Multimedia con 4+ botones (7 puntos)

### Requisitos para máxima nota:
- Reproducción de elemento multimedia (URL desde Firebase)
- Mínimo 4 zonas/botones de interacción

```javascript
// src/screens/MediaScreen.js
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
// Alternativa: react-native-video

export default function MediaScreen({ route }) {
  const { item } = route.params;
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Botón 1: Play/Pause
  const togglePlay = async () => {
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  // Botón 2: Stop (volver al inicio)
  const stop = async () => {
    await videoRef.current.stopAsync();
    await videoRef.current.setPositionAsync(0);
    setIsPlaying(false);
  };

  // Botón 3: Mute/Unmute
  const toggleMute = async () => {
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  // Botón 4: Velocidad de reproducción
  const changeSpeed = async () => {
    const newSpeed = playbackSpeed >= 2.0 ? 0.5 : playbackSpeed + 0.5;
    await videoRef.current.setRateAsync(newSpeed, true);
    setPlaybackSpeed(newSpeed);
  };

  // Botón 5 (extra): Retroceder 10s
  const rewind = async () => {
    const status = await videoRef.current.getStatusAsync();
    const newPos = Math.max(0, status.positionMillis - 10000);
    await videoRef.current.setPositionAsync(newPos);
  };

  // Botón 6 (extra): Adelantar 10s
  const forward = async () => {
    const status = await videoRef.current.getStatusAsync();
    await videoRef.current.setPositionAsync(status.positionMillis + 10000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.titulo}</Text>

      {/* Reproductor multimedia - URL desde Firebase */}
      <Video
        ref={videoRef}
        source={{ uri: item.mediaUrl }}
        style={styles.video}
        useNativeControls={false}
        resizeMode="contain"
        onPlaybackStatusUpdate={(status) => setIsPlaying(status.isPlaying)}
      />

      {/* Controles: mínimo 4 botones */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={rewind}>
          <Text style={styles.btnText}>⏪ -10s</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={togglePlay}>
          <Text style={styles.btnText}>{isPlaying ? '⏸ Pausa' : '▶️ Play'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={forward}>
          <Text style={styles.btnText}>⏩ +10s</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={stop}>
          <Text style={styles.btnText}>⏹ Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={toggleMute}>
          <Text style={styles.btnText}>{isMuted ? '🔇 Muted' : '🔊 Audio'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={changeSpeed}>
          <Text style={styles.btnText}>⚡ {playbackSpeed}x</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#000' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  video: { width: '100%', height: 250, backgroundColor: '#111' },
  controls: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
  btn: { padding: 12, backgroundColor: '#333', borderRadius: 8, minWidth: 80, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#6200ee' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
```

---

## 6. Dependencias (package.json)

```json
{
  "name": "producto3-fp067-react-native",
  "version": "1.0.0",
  "main": "App.js",
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "react-native-screens": "^3.29.0",
    "react-native-safe-area-context": "^4.8.2",
    "firebase": "^10.7.1",
    "expo-av": "^14.0.0"
  }
}
```

---

## 7. Documento de Entrega (PDF/DOC - 2 páginas)

### Contenido obligatorio:

1. **Enlace GitHub** (repositorio nuevo, sin node_modules)
2. **Enlace CodeSandbox** (proyecto compilando correctamente)
3. **Capturas de pantalla** de cada pantalla:
   - Listado con FlatList cargando datos de Firebase
   - Detalle mostrando todos los campos + zoom de imagen
   - Multimedia con los 4+ botones funcionando
4. **Justificación** de cada apartado (qué hace, por qué, cómo)
5. **Bibliografía**:
   - React Native Docs: https://reactnative.dev/docs
   - React Navigation: https://reactnavigation.org/docs
   - Firebase JS SDK: https://firebase.google.com/docs/web/setup
   - Expo AV: https://docs.expo.dev/versions/latest/sdk/av/

---

## Checklist Final

- [ ] FlatList con TODOS los datos de Firebase
- [ ] Stack Navigator con 3 pantallas
- [ ] Navegación completa: listado → detalle → multimedia
- [ ] Icono de vuelta atrás (automático con Stack)
- [ ] Botón de inicio en header
- [ ] Detalle muestra TODOS los campos de Firebase
- [ ] Imagen con click para zoom (Modal)
- [ ] Reproductor multimedia con URL de Firebase
- [ ] Mínimo 4 botones: Play/Pause, Stop, Mute, Velocidad (+Rewind, Forward)
- [ ] Proyecto compila en CodeSandbox (evitar -2 puntos)
- [ ] Documento con capturas + justificación + bibliografía
- [ ] .gitignore con node_modules
