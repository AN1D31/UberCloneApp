import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../services/authService';
import { logout } from '../store/authSlice';
import { launchImageLibrary } from 'react-native-image-picker';

export const ProfileScreen = () => {
  const dispatch = useDispatch();
  const userEmail = useSelector(state => state.auth.user?.email);
  const [profileImage, setProfileImage] = useState(null); // Estado para la foto

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout()); 
  };

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (!response.didCancel && !response.errorMessage && response.assets) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Cuenta</Text>
      </View>
      
      <View style={styles.infoContainer}>
        {/* Círculo interactivo para la foto */}
        <TouchableOpacity onPress={handleSelectImage} style={styles.avatar}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
            </Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.emailText}>{userEmail || 'Cargando...'}</Text>
        <Text style={styles.changePhotoText}>Toca el círculo para cambiar tu foto</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#000', padding: 20, paddingTop: 50, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  infoContainer: { alignItems: 'center', marginTop: 40, marginBottom: 50 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', marginBottom: 15, overflow: 'hidden' },
  avatarImage: { width: 100, height: 100 },
  avatarText: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  emailText: { fontSize: 18, color: '#333', fontWeight: '500' },
  changePhotoText: { marginTop: 8, fontSize: 13, color: '#888' },
  logoutButton: { backgroundColor: '#d32f2f', marginHorizontal: 20, paddingVertical: 15, borderRadius: 10, alignItems: 'center' },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});