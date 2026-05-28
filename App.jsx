import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { MapScreen } from './src/screens/MapScreen';
import { StripeProvider } from '@stripe/stripe-react-native';

// INSERT YOUR PUBLISHABLE KEY HERE (pk_test_...)
const STRIPE_PUBLISHABLE_KEY = "pk_test_51Tbtnf2WCUMAtWEWigQDZwTqZ8tRN9Q9SwdU0m2wrJ3YBWeTcM0vnUiSzc7fWyl75upvtSpLVApPWcyvw5TdXMc800x5z8q7b3";

const App = () => {
  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <MapScreen />
      </StripeProvider>
    </Provider>
  );
};

export default App;