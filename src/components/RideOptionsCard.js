import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { selectTravelTimeInformation } from '../store/navSlice';
import { useStripe } from '@stripe/stripe-react-native';

<<<<<<< HEAD
const STRIPE_SECRET_KEY = "sk_test_51Tbtnf2WCUMAtWEWzyplBjVaca6IFLsu7AMJdOEYvAp5itKzCDo39OvCXYAS53zIoIPPS0Q8OqgBCl1Hucmf9Q4C00CuoRy4vV";
const SURGE_CHARGE_RATE = 1.2;

=======
const SURGE_CHARGE_RATE = 1.2; 
>>>>>>> fc1df78e7276265424723ced8046e7b095d3695d
const RIDE_CATEGORIES = [
  { id: 'cat-1', title: 'Económico', subtitle: 'Viajes diarios y accesibles', icon: '🚗', multiplier: 1 },
  { id: 'cat-2', title: 'Uber XL', subtitle: 'Más espacio para grupos', icon: '🚙', multiplier: 1.4 },
  { id: 'cat-3', title: 'Premium', subtitle: 'Vehículos de lujo', icon: '🏎️', multiplier: 1.8 },
];

const COP_TO_USD_RATE = 0.00025;

export const RideOptionsCard = ({ onRideConfirmed, onCancel }) => {
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const [selectedId, setSelectedId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('efectivo'); 
  const [isProcessing, setIsProcessing] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const getRawPriceCOP = (multiplier) => {
    const baseFare = 3500;
    const pricePerKm = 1200;
    const pricePerMin = 250;
    const distanceCost = travelTimeInformation ? travelTimeInformation.distance * pricePerKm : 0;
    const timeCost = travelTimeInformation ? travelTimeInformation.duration * pricePerMin : 0;
    return Math.round((baseFare + distanceCost + timeCost) * multiplier * SURGE_CHARGE_RATE);
  };

  const getStripeAmountUSD = (copAmount) => {
    const usdAmount = copAmount * COP_TO_USD_RATE;
    const cents = Math.round(usdAmount * 100);
    return Math.max(cents, 50);
  };

<<<<<<< HEAD
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };

  const fetchPaymentIntentClientSecret = async (amountInCents) => {
    try {
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `amount=${amountInCents}&currency=usd`,
      });
      const data = await response.json();
      if (data.error) return null;
      return data.client_secret;
    } catch (error) { return null; }
  };

=======
const fetchPaymentIntentClientSecret = async (amount) => {
  try {

    const tempKey = "sk_test_51...YOUR_SECRET_KEY_HERE"; 
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

  // Open the Native Payment Sheet
>>>>>>> fc1df78e7276265424723ced8046e7b095d3695d
  const handlePayment = async () => {
    if (!selectedId) return;
    setIsProcessing(true);

    const selectedCategory = RIDE_CATEGORIES.find(cat => cat.id === selectedId);
    const copAmount = getRawPriceCOP(selectedCategory.multiplier);
    const finalPriceFormatted = formatPrice(copAmount);

    if (paymentMethod === 'efectivo') {
      setTimeout(() => {
        // En vez de alert nativo, enviamos la orden al mapa
        onRideConfirmed(finalPriceFormatted, 'Efectivo');
        setIsProcessing(false);
      }, 800);
      return;
    }

    const stripeAmount = getStripeAmountUSD(copAmount);
    const clientSecret = await fetchPaymentIntentClientSecret(stripeAmount);

    if (!clientSecret) {
      Alert.alert('Error', 'No se pudo conectar con la pasarela de pagos.');
      setIsProcessing(false);
      return;
    }

    const { error: initError } = await initPaymentSheet({ merchantDisplayName: 'UberCloneApp Inc.', paymentIntentClientSecret: clientSecret, defaultBillingDetails: { name: 'Usuario Demo' } });
    if (initError) { Alert.alert('Error', initError.message); setIsProcessing(false); return; }

    const { error: paymentError } = await presentPaymentSheet();
<<<<<<< HEAD
    if (paymentError) {
      Alert.alert('Pago fallido', paymentError.message);
    } else {
      // Envía la orden exitosa de Stripe al mapa
      onRideConfirmed(finalPriceFormatted, 'Tarjeta');
    }
=======

      if (paymentError) {
        Alert.alert(`Payment failed`, paymentError.message);
      } else {
        Alert.alert('Success!', 'Your ride is confirmed and paid.');
        onRideConfirmed();
      }

    
    
>>>>>>> fc1df78e7276265424723ced8046e7b095d3695d
    setIsProcessing(false);
  };

  const distanceText = travelTimeInformation?.distance ? `A ${travelTimeInformation.distance.toFixed(1)} km de distancia` : 'Selecciona un destino';

  return (
    <View style={styles.container}>
      <View style={styles.handleBar} />
      <Text style={styles.headerTitle}>Elige un Viaje</Text>
      <Text style={styles.headerSubtitle}>{distanceText}</Text>

      <FlatList
        data={RIDE_CATEGORIES}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;
          return (
            <TouchableOpacity style={[styles.optionContainer, isSelected && styles.selectedOption]} onPress={() => setSelectedId(item.id)} activeOpacity={0.7}>
              {isSelected && <View style={styles.selectedIndicator} />}
              <Text style={styles.optionIcon}>{item.icon}</Text>
              <View style={styles.optionDetails}>
                <Text style={styles.optionTitle}>{item.title}</Text>
                <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.optionPrice}>{formatPrice(getRawPriceCOP(item.multiplier))}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.paymentMethodContainer}>
        <TouchableOpacity style={[styles.methodButton, paymentMethod === 'efectivo' && styles.methodActive]} onPress={() => setPaymentMethod('efectivo')}>
          <Text style={[styles.methodText, paymentMethod === 'efectivo' && styles.methodTextActive]}>💵 Efectivo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.methodButton, paymentMethod === 'tarjeta' && styles.methodActive]} onPress={() => setPaymentMethod('tarjeta')}>
          <Text style={[styles.methodText, paymentMethod === 'tarjeta' && styles.methodTextActive]}>💳 Tarjeta</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={isProcessing}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.confirmButton, (!selectedId || isProcessing) && styles.disabledButton]} disabled={!selectedId || isProcessing} onPress={handlePayment} activeOpacity={0.8}>
          {isProcessing ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Confirmar</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: 8 },
  handleBar: { width: 40, height: 4, backgroundColor: '#DDDDDD', borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000000', textAlign: 'center' },
  headerSubtitle: { fontSize: 13, color: '#888888', textAlign: 'center', marginTop: 2, marginBottom: 8 },
  optionContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', position: 'relative' },
  selectedOption: { backgroundColor: '#F7F7F7' },
  selectedIndicator: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: '#000000', borderRadius: 2 },
  optionIcon: { fontSize: 26, marginRight: 12 },
  optionDetails: { flex: 1 },
  optionTitle: { fontSize: 15, fontWeight: '600', color: '#000000' },
  optionSubtitle: { fontSize: 11, color: '#888888', marginTop: 1 },
  optionPrice: { fontSize: 14, fontWeight: '600', color: '#000000' },
  paymentMethodContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, paddingHorizontal: 20 },
  methodButton: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 8, borderWidth: 1, borderColor: '#DDDDDD', alignItems: 'center' },
  methodActive: { backgroundColor: '#EEEEEE', borderColor: '#000000' },
  methodText: { fontSize: 14, color: '#555555', fontWeight: '500' },
  methodTextActive: { color: '#000000', fontWeight: 'bold' },
  actionButtonsContainer: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0', justifyContent: 'space-between' },
  cancelButton: { backgroundColor: '#fbe9e7', paddingVertical: 14, borderRadius: 10, alignItems: 'center', flex: 0.35, marginRight: 10 },
  cancelButtonText: { color: '#d32f2f', fontSize: 16, fontWeight: '700' },
  confirmButton: { backgroundColor: '#000000', paddingVertical: 14, borderRadius: 10, alignItems: 'center', flex: 0.65 },
  disabledButton: { backgroundColor: '#CCCCCC' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
=======
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
>>>>>>> fc1df78e7276265424723ced8046e7b095d3695d
