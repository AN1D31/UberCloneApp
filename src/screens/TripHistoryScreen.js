import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export const TripHistoryScreen = () => {
  // Datos temporales de prueba. Luego vendrán de Firestore.
  const dummyTrips = [
    { id: '1', date: '2026-05-28', destination: 'Universidad', price: '$15.000' },
    { id: '2', date: '2026-05-27', destination: 'Centro Comercial', price: '$12.500' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Trips</Text>
      
      <FlatList
        data={dummyTrips}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.tripCard}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.destText}>{item.destination}</Text>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  tripCard: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderColor: '#eeeeee',
    marginBottom: 10
  },
  dateText: { color: '#666', fontSize: 12 },
  destText: { color: '#000', fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  priceText: { color: '#00cc66', fontSize: 14, marginTop: 5 },
});