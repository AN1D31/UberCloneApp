import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { selectTravelTimeInformation } from '../store/navSlice';
import { useStripe } from '@stripe/stripe-react-native';

// WARNING: Using Secret Key on frontend is strictly for university demo purposes.
// In a real production environment, this must be handled by a secure backend.

const SURGE_CHARGE_RATE = 1.2; 
const RIDE_CATEGORIES = [
  { id: 'cat-1', title: 'Economy', multiplier: 1 },
  { id: 'cat-2', title: 'Uber XL', multiplier: 1.4 },
  { id: 'cat-3', title: 'Premium', multiplier: 1.8 },
];

export const RideOptionsCard = () => {
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const [selectedId, setSelectedId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // Helper to calculate the raw numeric price
  const getRawPrice = (multiplier) => {
    if (!travelTimeInformation) return 0;
    const baseFare = 3500;
    const pricePerKm = 1200; 
    const pricePerMin = 250;
    
    const distanceCost = travelTimeInformation.distance * pricePerKm;
    const timeCost = travelTimeInformation.duration * pricePerMin;
    
    return Math.round((baseFare + distanceCost + timeCost) * multiplier * SURGE_CHARGE_RATE);
  };

  // Helper to format price for UI display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(price);
  };

const fetchPaymentIntentClientSecret = async (amount) => {
  try {
    // For academic evaluation purposes, we can fetch or prompt this securely 
    // or use a temporary local string that is NOT tracked, but to pass GitHub Protection,
    // we must NOT leave the hardcoded token here.
    const tempKey = "sk_test_51...YOUR_SECRET_KEY_HERE"; // (We will remove this before committing)

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tempKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `amount=${amount}&currency=cop`, 
    });
    const data = await response.json();
    return data.client_secret;
  } catch (error) {
    console.error("Error fetching client secret:", error);
    return null;
  }
};

  // 2. Open the Native Payment Sheet
  const handlePayment = async () => {
    if (!selectedId) return;
    setIsProcessing(true);

    const selectedCategory = RIDE_CATEGORIES.find(cat => cat.id === selectedId);
    const amountToCharge = getRawPrice(selectedCategory.multiplier);

    // Get the secret from Stripe
    const clientSecret = await fetchPaymentIntentClientSecret(amountToCharge);
    
    if (!clientSecret) {
      Alert.alert("Error", "Could not connect to payment gateway.");
      setIsProcessing(false);
      return;
    }

    // Initialize the sheet
    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: 'UberCloneApp Inc.',
      paymentIntentClientSecret: clientSecret,
      defaultBillingDetails: {
        name: 'University Demo User',
      }
    });

    if (initError) {
      Alert.alert("Error", initError.message);
      setIsProcessing(false);
      return;
    }

    // Present the sheet to the user
    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      Alert.alert(`Payment failed`, paymentError.message);
    } else {
      Alert.alert('Success!', 'Your ride is confirmed and paid.');
      // Next Step: Trigger the real-time driver tracking animation here!
    }
    
    setIsProcessing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        Select a Ride - {travelTimeInformation?.distance?.toFixed(1) || 0} km 
      </Text>

      <FlatList
        data={RIDE_CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.optionContainer, item.id === selectedId && styles.selectedOption]}
            onPress={() => setSelectedId(item.id)}
          >
            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <Text style={styles.price}>
              {travelTimeInformation ? formatPrice(getRawPrice(item.multiplier)) : '$0'}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.confirmButton, !selectedId && styles.disabledButton]} 
          disabled={!selectedId || isProcessing}
          onPress={handlePayment}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Confirm Ride</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 15 },
  headerTitle: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 15, color: '#333' },
  optionContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  selectedOption: { backgroundColor: '#f2f2f2' },
  detailsContainer: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  price: { fontSize: 18, fontWeight: '600', color: '#000' },
  buttonContainer: { padding: 15, borderTopWidth: 1, borderTopColor: '#eee' },
  confirmButton: { backgroundColor: '#000', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  disabledButton: { backgroundColor: '#ccc' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});