import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

export const TripHistoryScreen = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector(state => state.auth.user?.uid);

  useEffect(() => {
    if (!userId) return;
    
    // Escuchar viajes en tiempo real desde Firebase
    const unsubscribe = firestore()
      .collection('trips')
      .where('userId', '==', userId)
      .onSnapshot(
        querySnapshot => {
          if (!querySnapshot) return;
          const tripsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Ordenamos por fecha en JavaScript para evitar errores de índices en Firebase a última hora
          tripsData.sort((a, b) => {
             const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
             const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
             return timeB - timeA;
          });
          
          setTrips(tripsData);
          setLoading(false);
        },
        error => {
          console.error("Error fetching trips: ", error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [userId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha reciente';
    const date = timestamp.toDate();
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' });
  };

  const renderTrip = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        <Text style={styles.priceText}>{item.price}</Text>
      </View>
      
      <View style={styles.routeContainer}>
        <View style={styles.timeline}>
          <View style={styles.dotStart} />
          <View style={styles.line} />
          <View style={styles.dotEnd} />
        </View>
        <View style={styles.locations}>
          <Text style={styles.locationText} numberOfLines={1}>{item.origin?.description || 'Origen'}</Text>
          <Text style={[styles.locationText, styles.destinationText]} numberOfLines={1}>{item.destination?.description || 'Destino'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Viajes</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
      ) : trips.length === 0 ? (
        <Text style={styles.emptyText}>Aún no has realizado ningún viaje.</Text>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={item => item.id}
          renderItem={renderTrip}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  header: { backgroundColor: '#000', padding: 20, paddingTop: 50, alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  listContent: { padding: 20, paddingBottom: 100 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 10 },
  dateText: { color: '#888', fontSize: 14, fontWeight: '500' },
  priceText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  routeContainer: { flexDirection: 'row' },
  timeline: { width: 20, alignItems: 'center', marginRight: 10 },
  dotStart: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#000' },
  line: { width: 2, height: 30, backgroundColor: '#E0E0E0', marginVertical: 2 },
  dotEnd: { width: 10, height: 10, borderRadius: 0, backgroundColor: '#276EF1' },
  locations: { flex: 1, justifyContent: 'space-between' },
  locationText: { fontSize: 15, color: '#333', fontWeight: '500', marginBottom: 15 },
  destinationText: { marginBottom: 0 }
});