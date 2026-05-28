import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Andres's Redux Store
import { store } from './src/store/store';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import { MapScreen } from './src/screens/MapScreen'; // Kept the named export to avoid breaking the map

// Initialize the Stack Navigator
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            
            {/* Laura's Authentication Flow */}
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />

            {/* Andres's Core Map Flow */}
            <Stack.Screen 
              name="Map" 
              component={MapScreen} 
              options={{ headerShown: false }} 
            />

          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;