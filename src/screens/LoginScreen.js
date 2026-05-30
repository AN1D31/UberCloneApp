import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { loginUser } from '../services/authService';
import { setUser } from '../store/authSlice';

const { width } = Dimensions.get('window');

const loginSchema = yup.object().shape({
  email: yup.string().email('Correo inválido').required('El correo es obligatorio'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es obligatoria'),
});

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onLoginPress = async (data) => {
    setIsLoading(true);
    const { user, error } = await loginUser(data.email, data.password);
    setIsLoading(false);
    if (error) {
      Alert.alert('Acceso denegado', 'Correo o contraseña incorrectos.');
      return;
    }
    dispatch(setUser({ uid: user.uid, email: user.email }));
  };

  return (
    <View style={styles.container}>
      {/* Background Decor (Liquid Blobs) */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <View style={styles.glassCard}>
        <Text style={styles.brandTitle}>UberClone</Text>
        <Text style={styles.welcomeText}>Bienvenido de nuevo</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#777"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <Text style={styles.label}>Contraseña</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#777"
                secureTextEntry
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit(onLoginPress)} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Ingresar</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ProfileRegistration')}>
            <Text style={styles.registerPrompt}>¿Nuevo en la app? <Text style={styles.registerLink}>Regístrate</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', justifyContent: 'center', alignItems: 'center' },
  // Efecto de fondo líquido
  blob: { position: 'absolute', width: 250, height: 250, borderRadius: 125, opacity: 0.15 },
  blob1: { backgroundColor: '#276EF1', top: -50, right: -50 },
  blob2: { backgroundColor: '#000000', bottom: -50, left: -50 },
  // Tarjeta Liquid Glass
  glassCard: {
    width: width * 0.88,
    padding: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 1)',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  brandTitle: { fontSize: 32, fontWeight: '900', color: '#000', textAlign: 'center', letterSpacing: -1 },
  welcomeText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30, marginTop: 5 },
  form: { width: '100%' },
  label: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 8, marginLeft: 4 },
  input: { 
    height: 55, 
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    fontSize: 16, 
    color: '#000', 
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  errorText: { color: '#E53935', fontSize: 11, marginBottom: 15, marginLeft: 5 },
  loginButton: { backgroundColor: '#000', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  registerPrompt: { marginTop: 25, textAlign: 'center', color: '#666', fontSize: 14 },
  registerLink: { color: '#276EF1', fontWeight: 'bold' }
});

export default LoginScreen;