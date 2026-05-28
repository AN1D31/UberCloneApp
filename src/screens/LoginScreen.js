import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginUser } from '../services/authService';

// 1. Define the validation schema
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email format.')
    .required('Email is required.'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long.')
    .required('Password is required.'),
});

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  // 2. Initialize react-hook-form
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  // 3. Handle form submission
  const onLoginPress = async (data) => {
    setIsLoading(true);
    const { user, error } = await loginUser(data.email, data.password);
    setIsLoading(false);

    if (error) {
      Alert.alert('Authentication Failed', error);
      return;
    }

    Alert.alert('Success', `Welcome back, ${user.email}!`);
    // TODO: Dispatch to Redux authSlice and navigate to MapScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Uber Clone Login</Text>

      {/* Email Input Controller */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      {/* Password Input Controller */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleSubmit(onLoginPress)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.loginButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>
      
      {/* Navigate to Registration */}
      <TouchableOpacity onPress={() => navigation.navigate('ProfileRegistration')}>
        <Text style={styles.registerPrompt}>Don't have an account? Register here.</Text>
      </TouchableOpacity>
    </View>
  );
};

// 4. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 5,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: '#000000', // Uber-like styling
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerPrompt: {
    marginTop: 20,
    color: '#0066cc',
    textAlign: 'center',
    fontSize: 14,
  }
});

export default LoginScreen;