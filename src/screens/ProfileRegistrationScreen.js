import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, Dimensions } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { registerUser } from '../services/authService';
import { setUser } from '../store/authSlice';

const { width } = Dimensions.get('window');

const schema = yup.object().shape({
  fullName: yup.string().required('Nombre obligatorio'),
  phoneNumber: yup.number().typeError('Debe ser número').required('Teléfono obligatorio'),
  email: yup.string().email('Correo inválido').required('Correo obligatorio'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña obligatoria'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'No coinciden').required('Confirma contraseña')
});

export const ProfileRegistrationScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { fullName: "", phoneNumber: "", email: "", password: "", confirmPassword: "" }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const userData = { fullName: data.fullName, phoneNumber: data.phoneNumber };
    const { user, error } = await registerUser(data.email, data.password, userData);
    setIsLoading(false);
    if (error) { Alert.alert('Error', error); return; }
    dispatch(setUser({ uid: user.uid, email: user.email }));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.glassCard}>
          <Text style={styles.pageTitle}>Crear Perfil</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo</Text>
            <Controller control={control} name="fullName" render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="Andrés Pérez" placeholderTextColor="#999" onChangeText={onChange} value={value} />
            )} />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

            <Text style={styles.label}>Correo Electrónico</Text>
            <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="correo@ejemplo.com" placeholderTextColor="#999" onChangeText={onChange} value={value} autoCapitalize="none" keyboardType="email-address" />
            )} />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

            <Text style={styles.label}>Teléfono</Text>
            <Controller control={control} name="phoneNumber" render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="300 123 4567" placeholderTextColor="#999" onChangeText={onChange} value={value} keyboardType="numeric" />
            )} />
            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}

            <Text style={styles.label}>Contraseña</Text>
            <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="Mínimo 6 caracteres" placeholderTextColor="#999" onChangeText={onChange} value={value} secureTextEntry autoCapitalize="none" />
            )} />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

            <Text style={styles.label}>Confirmar Contraseña</Text>
            <Controller control={control} name="confirmPassword" render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="Repite tu contraseña" placeholderTextColor="#999" onChangeText={onChange} value={value} secureTextEntry autoCapitalize="none" />
            )} />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrarse Ahora</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
            <Text style={styles.backText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  scrollContent: { paddingVertical: 60, alignItems: 'center' },
  blob: { position: 'absolute', width: 300, height: 300, borderRadius: 150, opacity: 0.12 },
  blob1: { backgroundColor: '#276EF1', top: 20, left: -100 },
  blob2: { backgroundColor: '#000', bottom: 20, right: -100 },
  glassCard: {
    width: width * 0.9,
    padding: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 1)',
    elevation: 10,
  },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#000', textAlign: 'center', marginBottom: 25 },
  inputGroup: { width: '100%' },
  label: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 5, marginLeft: 5 },
  input: { height: 50, backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 12, paddingHorizontal: 15, fontSize: 15, color: '#000', marginBottom: 5, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  errorText: { color: 'red', marginBottom: 12, fontSize: 11, marginLeft: 5 },
  registerButton: { backgroundColor: '#000', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  backText: { color: '#666', textAlign: 'center', fontSize: 14 }
});