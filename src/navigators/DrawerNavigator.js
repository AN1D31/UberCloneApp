import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../services/authService';
import { logout } from '../store/authSlice';

import { MapScreen } from '../screens/MapScreen';
import { TripHistoryScreen } from '../screens/TripHistoryScreen';

const Drawer = createDrawerNavigator();

// Custom drawer content
const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();
  const userEmail = useSelector(state => state.auth.user?.email);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout()); // Triggers auto-redirect to login
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarText}>{userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}</Text>
          </View>
          <Text style={styles.userEmailText}>{userEmail || 'Loading...'}</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.drawerFooter}>
        <DrawerItem label="Sign Out" onPress={handleLogout} />
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
      <Drawer.Screen name="HomeMap" component={MapScreen} options={{ title: 'Home', headerShown: false }} />
      <Drawer.Screen name="TripHistory" component={TripHistoryScreen} options={{ title: 'My Trips' }} />
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