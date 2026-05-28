import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export const MapScreen = () => {
  const initialRegion = {
    latitude: 6.2442,
    longitude: -75.5812,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
});