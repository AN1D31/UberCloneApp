import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { registerUser } from '../services/authService';
import { setUser } from '../store/authSlice';

// 1. Updated validation schema to include passwords
const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required').max(50, 'Max 50 characters allowed'),
  phoneNumber: yup.number().typeError('Must be a valid number').required('Phone number is required'),
  gender: yup.string().required('Gender selection is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  language: yup.string().oneOf(['English', 'Spanish']).required('Language preference is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm your password')
});

export const ProfileRegistrationScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '', phoneNumber: '', gender: 'English', email: '', language: 'Spanish', password: '', confirmPassword: ''
    }
  });


// 2. Firebase Connection Logic
  const onSubmit = async (data) => {
    setIsLoading(true);
    
    const userData = {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      language: data.language
    };

    const { user, error } = await registerUser(data.email, data.password, userData);
    setIsLoading(false);

    if (error) {
      Alert.alert('Registration Failed', error);
      return;
    }

    // Save user session in Redux global state
    dispatch(setUser({ uid: user.uid, email: user.email }));
    
    Alert.alert('Success', 'Account created successfully!');
  }; 

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.imagePlaceholder}>
        <Text>Photo</Text>
      </View>

      <Controller control={control} name="fullName" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="Full Name" onChangeText={onChange} value={value} />
      )} />
      {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

      <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="Email" onChangeText={onChange} value={value} autoCapitalize="none" keyboardType="email-address" />
      )} />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      {/* Basic implementations for the remaining required fields to pass validation */}
      <Controller control={control} name="phoneNumber" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="Phone Number" onChangeText={onChange} value={value} keyboardType="numeric" />
      )} />
      {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}

      {/* New Password Fields */}
      <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="Password" onChangeText={onChange} value={value} secureTextEntry autoCapitalize="none" />
      )} />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <Controller control={control} name="confirmPassword" render={({ field: { onChange, value } }) => (
        <TextInput style={styles.input} placeholder="Confirm Password" onChangeText={onChange} value={value} secureTextEntry autoCapitalize="none" />
      )} />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Register" onPress={handleSubmit(onSubmit)} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 50 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 5, borderRadius: 5 },
  errorText: { color: 'red', marginBottom: 10, fontSize: 12 },
  imagePlaceholder: { width: 100, height: 100, backgroundColor: '#e1e1e1', alignSelf: 'center', marginBottom: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }
});