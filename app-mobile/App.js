import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Platform } from 'react-native';

import Inicio from './screens/Inicio';
import Detalle from './screens/Detalle';
import Reproductor from './screens/Reproductor';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Inicio"
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#0D1B3E', // Azul oscuro institucional
            borderBottomWidth: 3,
            borderBottomColor: '#FDB927', // Línea amarilla Lakers
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('Inicio')}
              title="Inicio"
              color={Platform.OS === 'ios' ? '#fff' : '#FDB927'} 
            />
          ),
        })}
      >
        <Stack.Screen 
          name="Inicio" 
          component={Inicio} 
          options={{ title: 'Los Angeles Lakers' }} 
        />
        <Stack.Screen 
          name="Detalle" 
          component={Detalle} 
          options={{ title: 'Detalle del Jugador' }} 
        />
        <Stack.Screen 
          name="Reproductor" 
          component={Reproductor} 
          options={{ title: 'Highlights Oficiales' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}