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

    // Subscribe to real-time trips updates for the current user
    const unsubscribe = firestore()
      .collection('trips')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const tripsData = [];
        if (querySnapshot) {
          querySnapshot.forEach(doc => {
            tripsData.push({ id: doc.id, ...doc.data() });
          });
        }
        setTrips(tripsData);
        setLoading(false);
      }, error => {
        console.error("Error fetching trips: ", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [userId]);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#000" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Trips</Text>
      {trips.length === 0 ? (
        <Text style={styles.emptyText}>You haven't taken any trips yet.</Text>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.tripCard}>
              <Text style={styles.dateText}>
                {item.createdAt ? item.createdAt.toDate().toLocaleDateString() : 'Recent'}
              </Text>
              <Text style={styles.destText}>{item.destination?.description || 'Unknown Destination'}</Text>
              <Text style={styles.priceText}>{item.price || 'Pending'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
  tripCard: { padding: 15, borderBottomWidth: 1, borderColor: '#eeeeee', marginBottom: 10 },
  dateText: { color: '#666', fontSize: 12 },
  destText: { color: '#000', fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  priceText: { color: '#00cc66', fontSize: 14, marginTop: 5 },
});