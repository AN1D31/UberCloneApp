import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../services/authService';
import { logout } from '../store/authSlice';

import { MapScreen } from '../screens/MapScreen';
import { TripHistoryScreen } from '../screens/TripHistoryScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();
  const userEmail = useSelector(state => state.auth.user?.email);

  // Función que desloguea de Firebase y de Redux
  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout()); 
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarText}>{userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}</Text>
          </View>
          <Text style={styles.userEmailText}>{userEmail || 'Cargando...'}</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
      {/* Botón de Cerrar Sesión */}
      <View style={styles.drawerFooter}>
        <DrawerItem 
          label="Cerrar Sesión" 
          onPress={handleLogout} 
          labelStyle={{ color: '#d32f2f', fontWeight: 'bold' }} 
        />
      </View>
    </View>
  );
};

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator 
      initialRouteName="HomeMap"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeMap" component={MapScreen} options={{ title: 'Pedir Viaje', headerShown: false }} />
      <Drawer.Screen name="TripHistory" component={TripHistoryScreen} options={{ title: 'Mis Viajes (Historial)' }} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: { padding: 20, backgroundColor: '#000', marginBottom: 10 },
  profileAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  userEmailText: { color: '#fff', fontSize: 16 },
  drawerFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#eeeeee', paddingBottom: 30 }
});