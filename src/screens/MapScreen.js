// src/screens/MapScreen.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrigin, selectDestination, setTravelTimeInformation } from '../store/navSlice';
import { LocationSearchBar } from '../components/LocationSearchBar';
import { RideOptionsCard } from '../components/RideOptionsCard'; // Lo crearemos en el Paso 2

// INSERT YOUR ACTUAL API KEY HERE
const GOOGLE_MAPS_API_KEY = "TU_API_KEY_AQUI"; 

export const MapScreen = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const dispatch = useDispatch();
  const mapRef = useRef(null);

  useEffect(() => {
    if (!origin || !destination) return;
    // We handle the camera adjustment inside MapViewDirections 'onReady' now
  }, [origin, destination]);

  const defaultRegion = {
    latitude: 6.2442, // Medellin center
    longitude: -75.5812,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      {/* Top half: Map and Search */}
      <View style={styles.mapContainer}>
        <LocationSearchBar type="destination" />

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={defaultRegion}
        >
          {origin?.location && destination?.location && (
            <MapViewDirections
              origin={origin.location}
              destination={destination.location}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor="black"
              onReady={(result) => {
                // Adjust camera to fit the generated route
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                });
                
                // Dispatch calculation results to Redux Store
                dispatch(setTravelTimeInformation({
                  distance: result.distance, // in km
                  duration: result.duration, // in mins
                }));
              }}
            />
          )}

          {origin?.location && (
            <Marker coordinate={origin.location} title="Origin" identifier="origin" pinColor="#000000" />
          )}

          {destination?.location && (
            <Marker coordinate={destination.location} title="Destination" identifier="destination" pinColor="#EA4335" />
          )}
        </MapView>
      </View>

      {/* Bottom half: Ride Options Card */}
      <View style={styles.bottomContainer}>
        <RideOptionsCard />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 2, // Takes 2/3 of the screen
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomContainer: {
    flex: 1, // Takes 1/3 of the screen for the UI card
    backgroundColor: 'white',
  }
});