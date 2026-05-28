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
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <SafeAreaProvider>
          <NavigationContainer>
            {/* The entire routing logic is now encapsulated here */}
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </StripeProvider>
    </Provider>
  );
};

export default App;