import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrigin, selectDestination, setTravelTimeInformation } from '../store/navSlice';
import { LocationSearchBar } from '../components/LocationSearchBar';
import { RideOptionsCard } from '../components/RideOptionsCard';

const GOOGLE_MAPS_API_KEY = "AIzaSyCV20t3wxIbdLwTc0TTGJ3vwxvT57sDX5w";

export const MapScreen = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const dispatch = useDispatch();
  const mapRef = useRef(null);

  // Real-time tracking states
  const [isRideActive, setIsRideActive] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);

  // Simulate Driver Moving towards Origin via intervals
  useEffect(() => {
    if (!isRideActive || !origin?.location) return;

    // Start driver slightly offset to simulate approaching
    let progress = 0;
    const startLat = origin.location.latitude + 0.005;
    const startLng = origin.location.longitude + 0.005;
    
    setDriverLocation({ latitude: startLat, longitude: startLng });

    const trackingInterval = setInterval(() => {
      progress += 0.1;
      if (progress >= 1.0) {
        clearInterval(trackingInterval);
        Alert.alert("Driver Arrived", "Your driver has arrived at your location!");
        setIsRideActive(false);
        setDriverLocation(null);
        return;
      }

      // Linear interpolation to smoothly move the car marker
      const currentLat = startLat + (origin.location.latitude - startLat) * progress;
      const currentLng = startLng + (origin.location.longitude - startLng) * progress;

      setDriverLocation({
        latitude: currentLat,
        longitude: currentLng
      });
    }, 2000); // Updates every 2 seconds

    return () => clearInterval(trackingInterval);
  }, [isRideActive, origin]);

  const defaultRegion = {
    latitude: 6.2442,
    longitude: -75.5812,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {/* Hide search bar if the ride is already processing/active */}
        {!isRideActive && <LocationSearchBar type="destination" />}

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={defaultRegion}
        >
          {origin?.location && destination?.location && !isRideActive && (
            <MapViewDirections
              origin={origin.location}
              destination={destination.location}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor="black"
              onReady={(result) => {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                });
                dispatch(setTravelTimeInformation({
                  distance: result.distance,
                  duration: result.duration,
                }));
              }}
            />
          )}

          {origin?.location && (
            <Marker coordinate={origin.location} title="Pickup Location" identifier="origin" pinColor="#000000" />
          )}

          {destination?.location && !isRideActive && (
            <Marker coordinate={destination.location} title="Dropoff" identifier="destination" pinColor="#EA4335" />
          )}

          {/* Real-time Driver Animated Marker */}
          {driverLocation && (
            <Marker
              coordinate={driverLocation}
              title="Your Driver"
              description="Approaching..."
              identifier="driver"
              pinColor="#00FF00" // Can be replaced with a car icon using image={require('...')}
            />
          )}
        </MapView>
      </View>

      <View style={styles.bottomContainer}>
        {/* Pass the state setter to the card so the payment success can trigger it */}
        <RideOptionsCard onRideConfirmed={() => setIsRideActive(true)} isRideActive={isRideActive} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { flex: 2 },
  map: { ...StyleSheet.absoluteFillObject },
  bottomContainer: { flex: 1, backgroundColor: 'white' }
});