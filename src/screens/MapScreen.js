import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../services/authService';
import { logout } from '../store/authSlice';

export const MapScreen = () => {
  const dispatch = useDispatch();

  const initialRegion = {
    latitude: 6.2442,
    longitude: -75.5812,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleLogout = async () => {
    await logoutUser(); // Borra la sesión de Firebase
    dispatch(logout()); // Borra la sesión de Redux (lo devuelve al Login automáticamente)
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      />
      
      {/* Botón flotante de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: 'bold',
  }
});