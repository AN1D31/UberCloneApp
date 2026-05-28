// src/components/RideOptionsCard.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { selectTravelTimeInformation } from '../store/navSlice';

// Surge pricing multiplier (can be dynamic later based on time/demand)
const SURGE_CHARGE_RATE = 1.2; 

// Vehicle categories array
const RIDE_CATEGORIES = [
  { id: 'cat-1', title: 'Economy', multiplier: 1 },
  { id: 'cat-2', title: 'Uber XL', multiplier: 1.4 },
  { id: 'cat-3', title: 'Premium', multiplier: 1.8 },
];

export const RideOptionsCard = () => {
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const [selectedId, setSelectedId] = useState(null);

  // Dynamic price calculation formula
  const calculatePrice = (multiplier) => {
    if (!travelTimeInformation) return 0;
    
    // Example logic: (Base Rate + Distance Rate + Time Rate) * Multipliers
    const baseFare = 3500; // Base COP
    const pricePerKm = 1200; 
    const pricePerMin = 250;
    
    const distanceCost = travelTimeInformation.distance * pricePerKm;
    const timeCost = travelTimeInformation.duration * pricePerMin;
    
    const totalCost = (baseFare + distanceCost + timeCost) * multiplier * SURGE_CHARGE_RATE;
    
    // Formatting as Colombian Peso currency standard
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(totalCost);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        Select a Ride - {travelTimeInformation?.distance?.toFixed(1)} km 
        ({travelTimeInformation?.duration?.toFixed(0)} mins)
      </Text>

      <FlatList
        data={RIDE_CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.optionContainer,
              item.id === selectedId && styles.selectedOption
            ]}
            onPress={() => setSelectedId(item.id)}
          >
            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <Text style={styles.price}>
              {travelTimeInformation ? calculatePrice(item.multiplier) : '$0'}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} disabled={!selectedId}>
          <Text style={styles.buttonText}>Confirm Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#f2f2f2', // Light grey highlight
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  buttonContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});