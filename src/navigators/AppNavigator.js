import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { setUser, logout } from '../store/authSlice';

// Screens
import LoginScreen from '../screens/LoginScreen';
import { ProfileRegistrationScreen } from '../screens/ProfileRegistrationScreen';
import { MapScreen } from '../screens/MapScreen'; 

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const dispatch = useDispatch();
  
  // Leemos el estado global para saber si hay alguien logueado
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  // Escuchamos a Firebase cada vez que la app se abre
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email }));
      } else {
        dispatch(logout());
      }
      if (initializing) setInitializing(false);
    });
    return subscriber; // Limpieza al desmontar
  }, [initializing, dispatch]);

  if (initializing) return null; // Aquí podría ir un logo de carga

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        // --- GRUPO 1: PANTALLAS DE INVITADOS ---
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProfileRegistration" component={ProfileRegistrationScreen} options={{ title: 'Register Profile' }} />
        </>
      ) : (
        // --- GRUPO 2: PANTALLAS DE USUARIOS LOGUEADOS ---
        <>
          <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};