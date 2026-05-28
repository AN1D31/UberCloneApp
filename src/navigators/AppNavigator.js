import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { setUser, logout } from '../store/authSlice';

import LoginScreen from '../screens/LoginScreen';
import { ProfileRegistrationScreen } from '../screens/ProfileRegistrationScreen';
import { DrawerNavigator } from './DrawerNavigator';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const dispatch = useDispatch();
  
  // Check global auth state
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  // Listen for Firebase auth state changes on mount
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email }));
      } else {
        dispatch(logout());
      }
      if (initializing) setInitializing(false);
    });
    
    return subscriber; // Cleanup subscription
  }, [initializing, dispatch]);

  // TODO: Add splash screen component here later
  if (initializing) return null; 

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        // Unauthenticated flow
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProfileRegistration" component={ProfileRegistrationScreen} options={{ title: 'Register Profile' }} />
        </>
      ) : (
        // Authenticated flow
        <>
          <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};