import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { MapScreen } from './src/screens/MapScreen';

const App = () => {
  return (
    <Provider store={store}>
      <MapScreen />
    </Provider>
  );
};

export default App;