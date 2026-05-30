import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import firestore from '@react-native-firebase/firestore'; 
import { selectOrigin, selectDestination, setTravelTimeInformation, setDestination } from '../store/navSlice';

import { LocationSearchBar } from '../components/LocationSearchBar';
import { RideOptionsCard } from '../components/RideOptionsCard';

const calculateMockDistance = (loc1, loc2) => {
  const R = 6371; 
  const dLat = (loc2.latitude - loc1.latitude) * (Math.PI/180);
  const dLon = (loc2.longitude - loc1.longitude) * (Math.PI/180);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(loc1.latitude * (Math.PI/180)) * Math.cos(loc2.latitude * (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
};

export const MapScreen = () => {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const userId = useSelector(state => state.auth.user?.uid);

  const [isRideActive, setIsRideActive] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  
  // Modales
  const [showDriverOnWayModal, setShowDriverOnWayModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Datos temporales del viaje
  const [completedTripPrice, setCompletedTripPrice] = useState('');
  const [usedPaymentMethod, setUsedPaymentMethod] = useState('');

  const initialRegion = { latitude: 6.2442, longitude: -75.5812, latitudeDelta: 0.0922, longitudeDelta: 0.0421 };

  useEffect(() => {
    if (origin?.location && destination?.location) {
       const dist = calculateMockDistance(origin.location, destination.location);
       const timeMins = (dist / 30) * 60; 
       dispatch(setTravelTimeInformation({ distance: dist, duration: timeMins }));
       
       mapRef.current?.fitToSuppliedMarkers(['origin', 'destination'], { edgePadding: { top: 50, right: 50, bottom: 350, left: 50 } });
    }
  }, [origin, destination]);

  useEffect(() => {
    if (!isRideActive || !origin?.location) return;
    let progress = 0;
    const startLat = origin.location.latitude + 0.005; 
    const startLng = origin.location.longitude + 0.005;
    setDriverLocation({ latitude: startLat, longitude: startLng });

    const trackingInterval = setInterval(() => {
      progress += 0.1;
      if (progress >= 1.0) {
        clearInterval(trackingInterval);
        setIsRideActive(false);
        setDriverLocation(null);
        setShowDriverOnWayModal(false); // Por si el usuario no cerró el primero
        setShowCompletionModal(true); // Muestra el mensaje final
        return;
      }
      const currentLat = startLat + (origin.location.latitude - startLat) * progress;
      const currentLng = startLng + (origin.location.longitude - startLng) * progress;
      setDriverLocation({ latitude: currentLat, longitude: currentLng });
    }, 2000); 

    return () => clearInterval(trackingInterval);
  }, [isRideActive, origin]);

  const handleRideConfirmed = async (finalPrice, methodText) => {
    setCompletedTripPrice(finalPrice); 
    setUsedPaymentMethod(methodText);
    
    // Mostramos la ventana moderna indicando que va en camino
    setShowDriverOnWayModal(true);
    setIsRideActive(true); // Oculta la UI de abajo y arranca el ciclo
    
    if (userId) {
      try {
        await firestore().collection('trips').add({ userId: userId, origin: origin, destination: destination, price: finalPrice, createdAt: firestore.FieldValue.serverTimestamp() });
      } catch (error) { console.error("Error saving trip", error); }
    }
  };

  const handleCancelRide = () => {
    dispatch(setDestination(null));
  };

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
    dispatch(setDestination(null)); 
  };

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={initialRegion} showsUserLocation={true}>
        {origin?.location && <Marker coordinate={origin.location} title="Punto de partida" description={origin.description} identifier="origin" pinColor="#000000" />}
        {destination?.location && !isRideActive && <Marker coordinate={destination.location} title="Destino" description={destination.description} identifier="destination" />}
        {origin?.location && destination?.location && !isRideActive && <Polyline coordinates={[origin.location, destination.location]} strokeWidth={4} strokeColor="#FFFFFF" />}
        {driverLocation && <Marker coordinate={driverLocation} title="Tu conductor" description="En camino..." identifier="driver" pinColor="#00FF00" />}
      </MapView>

      {!isRideActive && (
        <>
          <LocationSearchBar type="origin" topOffset={50} />
          <LocationSearchBar type="destination" topOffset={115} />
          {destination && (
            <View style={styles.rideOptionsContainer}>
              <RideOptionsCard onRideConfirmed={handleRideConfirmed} onCancel={handleCancelRide} />
            </View>
          )}
        </>
      )}

      {/* 1. VENTANA: CONDUCTOR EN CAMINO */}
      <Modal visible={showDriverOnWayModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalIcon}>🚕</Text>
            <Text style={styles.modalTitle}>¡Viaje Confirmado!</Text>
            <Text style={styles.modalText}>
              Pago validado con éxito ({usedPaymentMethod}). Tu conductor asignado ya se encuentra en camino.
            </Text>
            
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowDriverOnWayModal(false)}>
              <Text style={styles.modalButtonText}>Ver en el mapa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. VENTANA: VIAJE COMPLETADO */}
      <Modal visible={showCompletionModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalIcon}>🎉</Text>
            <Text style={styles.modalTitle}>¡Llegaste a tu destino!</Text>
            <Text style={styles.modalText}>Tu viaje ha concluido con éxito. Los detalles se han guardado en tu historial.</Text>
            <Text style={styles.modalPrice}>{completedTripPrice}</Text>
            
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseCompletionModal}>
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  rideOptionsContainer: { position: 'absolute', bottom: 10, width: '94%', alignSelf: 'center', height: '48%', backgroundColor: 'rgba(255, 255, 255, 0.92)', borderRadius: 24, borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 1)', elevation: 0, overflow: 'hidden' },
  
  // Estilos compartidos de las Ventanas Emergentes (Glassmorphism)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { 
    width: '85%', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 30, padding: 30, alignItems: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20
  },
  modalIcon: { fontSize: 50, marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 10, textAlign: 'center' },
  modalText: { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 20, lineHeight: 22 },
  modalPrice: { fontSize: 26, fontWeight: '900', color: '#000', marginBottom: 30 },
  modalButton: { backgroundColor: '#000', width: '100%', paddingVertical: 16, borderRadius: 15, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});