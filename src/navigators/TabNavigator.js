import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { selectDestination } from '../store/navSlice';

import { MapScreen } from '../screens/MapScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TripHistoryScreen } from '../screens/TripHistoryScreen'; // Importamos el historial

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const destination = useSelector(selectDestination);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { 
          display: destination ? 'none' : 'flex',
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0, 
          backgroundColor: 'rgba(255, 255, 255, 0.75)', 
          borderRadius: 35,
          height: 70,
          borderWidth: 1.5,
          borderColor: 'rgba(255, 255, 255, 1)', 
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="HomeMap" 
        component={MapScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/home.png' }} style={[styles.iconImage, { tintColor: focused ? '#000000' : '#A0A0A0' }]} />
            </View>
          ) 
        }} 
      />
      <Tab.Screen 
        name="TripHistory" 
        component={TripHistoryScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/time.png' }} style={[styles.iconImage, { tintColor: focused ? '#000000' : '#A0A0A0' }]} />
            </View>
          ) 
        }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconFocused]}>
              <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/user.png' }} style={[styles.iconImage, { tintColor: focused ? '#000000' : '#A0A0A0' }]} />
            </View>
          ) 
        }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: { justifyContent: 'center', alignItems: 'center', height: 50, width: 50, borderRadius: 25, marginTop: 15 },
  iconFocused: { backgroundColor: 'rgba(255, 255, 255, 0.9)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  iconImage: { width: 26, height: 26, resizeMode: 'contain' }
});