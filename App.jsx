import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StripeProvider } from '@stripe/stripe-react-native';

// Andres's Redux Store
import { store } from './src/store/store';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import { MapScreen } from './src/screens/MapScreen'; 
import { ProfileRegistrationScreen } from './src/screens/ProfileRegistrationScreen'; 

// Initialize the Stack Navigator
const Stack = createNativeStackNavigator();

// Stripe Configuration
const STRIPE_PUBLISHABLE_KEY = "pk_test_51Tbtnf2WCUMAtWEWigQDZwTqZ8tRN9Q9SwdU0m2wrJ3YBWeTcM0vnUiSzc7fWyl75upvtSpLVApPWcyvw5TdXMc800x5z8q7b3";

const App = () => {
  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              
              {/* Laura's Authentication Flow */}
              <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{ headerShown: false }} 
              />

              <Stack.Screen 
                name="ProfileRegistration" // 2. Registered route for the registration screen
                component={ProfileRegistrationScreen} 
                options={{ title: 'Register Profile' }} 
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
      </StripeProvider>
    </Provider>
  );
};

export default App;