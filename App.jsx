import 'react-native-gesture-handler'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';

// Global Store
import { store } from './src/store/store';

// Central Navigator
import { AppNavigator } from './src/navigators/AppNavigator';

// Stripe Configuration
const STRIPE_PUBLISHABLE_KEY = "pk_test_51Tbtnf2WCUMAtWEWigQDZwTqZ8tRN9Q9SwdU0m2wrJ3YBWeTcM0vnUiSzc7fWyl75upvtSpLVApPWcyvw5TdXMc800x5z8q7b3";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
          <SafeAreaProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </StripeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
//commit test