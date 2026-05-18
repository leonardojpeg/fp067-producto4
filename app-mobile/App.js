import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, Platform } from 'react-native';

import ListScreen from './screens/ListScreen';
import DetailScreen from './screens/DetailScreen';
import MediaScreen from './screens/MediaScreen';

const Stack = createStackNavigator();

export default function App() {
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
