import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, Alert, Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import ListScreen from './screens/ListScreen';
import DetailScreen from './screens/DetailScreen';
import MediaScreen from './screens/MediaScreen';

const Stack = createStackNavigator();

export default function App() {

  useEffect(() => {
    setupNotifications();
  }, []);

  /**
   * Configuración de notificaciones push con Firebase Cloud Messaging
   * - Solicita permisos al usuario
   * - Obtiene token FCM del dispositivo
   * - Se suscribe al topic 'all' para recibir notificaciones
   * - Configura listeners para foreground, background y apertura desde notificación
   */
  async function setupNotifications() {
    try {
      // 1. Solicitar permisos de notificación (Android 13+)
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permiso de notificación denegado por el usuario');
        }
      }

      // Solicitar permiso de Firebase Messaging
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('Permisos de notificación no concedidos');
        return;
      }

      // 2. Obtener token FCM del dispositivo
      const token = await messaging().getToken();
      console.log('FCM Token (móvil):', token);

      // 3. Suscribirse al topic 'all' para recibir notificaciones de Cloud Functions
      await messaging().subscribeToTopic('all');
      console.log('Suscrito al topic "all"');

      // 4. Listener: notificación recibida en FOREGROUND
      const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
        console.log('Notificación recibida en foreground:', remoteMessage);
        Alert.alert(
          remoteMessage.notification?.title || 'Notificación',
          remoteMessage.notification?.body || 'Tienes una nueva notificación'
        );
      });

      // 5. Listener: app abierta desde una notificación
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('App abierta desde notificación:', remoteMessage.data);
      });

      // 6. Verificar si la app fue abierta por una notificación (app cerrada)
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log('App abierta desde notificación (cold start):', initialNotification.data);
      }

      return unsubscribeForeground;
    } catch (error) {
      console.error('Error configurando notificaciones:', error);
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="List"
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#0D1B3E',
            borderBottomWidth: 3,
            borderBottomColor: '#FDB927',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // Botón de inicio en todas las pantallas (excepto List)
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('List')}
              style={{ marginRight: 15 }}
            >
              <Text style={{ color: '#FDB927', fontSize: 15, fontWeight: 'bold' }}>
                🏠 Inicio
              </Text>
            </TouchableOpacity>
          ),
        })}
      >
        <Stack.Screen
          name="List"
          component={ListScreen}
          options={{ title: 'Jugadores NBA', headerRight: () => null }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Detalle del Jugador' }}
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

// Handler para notificaciones en BACKGROUND (debe estar fuera del componente)
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Mensaje recibido en background:', remoteMessage);
});
