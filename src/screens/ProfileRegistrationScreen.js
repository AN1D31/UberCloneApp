// src/screens/ProfileRegistrationScreen.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema ensuring no nulls or empty fields
const schema = yup.object().shape({
  fullName: yup.string()
    .required('Full name is required')
    .max(50, 'Max 50 characters allowed'),
  phoneNumber: yup.number()
    .typeError('Must be a valid number')
    .required('Phone number is required'),
  gender: yup.string()
    .required('Gender selection is required'), // Will integrate a Picker/Dropdown later
  email: yup.string()
    .email('Must be a valid email with @ and domain')
    .required('Email is required'),
  language: yup.string()
    .oneOf(['English', 'Spanish'])
    .required('Language preference is required')
});

export const ProfileRegistrationScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    // Logic to register user to Firebase goes here
    console.log("Valid user data ready for backend:", data);
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture Placeholder */}
      <View style={styles.imagePlaceholder}>
        <Text>Photo</Text>
      </View>

      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, value } }) => (
          <TextInput 
            style={styles.input} 
            placeholder="Full Name" 
            onChangeText={onChange} 
            value={value} 
          />
        )}
      />
      {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            onChangeText={onChange} 
            value={value} 
            autoCapitalize="none" 
            keyboardType="email-address" 
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      {/* Other input fields (Phone, Gender Dropdown, Language) go here */}

      <Button title="Register" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 5, borderRadius: 5 },
  errorText: { color: 'red', marginBottom: 10, fontSize: 12 },
  imagePlaceholder: { width: 100, height: 100, backgroundColor: '#e1e1e1', alignSelf: 'center', marginBottom: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 50 }
});