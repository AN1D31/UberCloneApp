import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { setUser, logout } from '../store/authSlice';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import { ProfileRegistrationScreen } from '../screens/ProfileRegistrationScreen';
import { TabNavigator } from './TabNavigator'; // Importamos la nueva barra inferior

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email }));
      } else {
        dispatch(logout());
      }
      if (initializing) setInitializing(false);
    });
    
    return subscriber; 
  }, [initializing, dispatch]);

  if (initializing) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  ); 

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProfileRegistration" component={ProfileRegistrationScreen} options={{ title: 'Registro de Perfil' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};