import React, { useState, useCallback } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { useDispatch } from 'react-redux';
import axios from 'axios';
import { login } from '../redux/authSlice';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();


  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://192.168.88.161:3000/api/auth/login',
        { email, password }
      );

      const data = response.data;

      if (data.success) {
        dispatch(login({ email, token: data.token }));
        Alert.alert('Success', 'Login successful!');
        navigation.navigate('Home' as never);
      } else {
        Alert.alert('Login failed', data.message || 'Invalid credentials');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Login failed', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, password, dispatch, navigation]);

  const goToRegister = useCallback(() => {
    navigation.navigate('Register' as never);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image
            source={require('../../assets/logosportin.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome to SportIn</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#888"
          />

          {loading ? (
            <ActivityIndicator size="large" color="#5E4B8B" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={goToRegister} style={styles.signupLink}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text style={styles.signupTextBold}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  scrollContainer: { alignItems: 'center', paddingBottom: 40 },
  image: { width: 220, height: 160, marginBottom: 16, marginTop: 32 },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#5E4B8B',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
  },
  button: {
    backgroundColor: '#5E4B8B',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  signupLink: { marginTop: 20 },
  signupText: { fontSize: 14, color: '#666' },
  signupTextBold: { color: '#5E4B8B', fontWeight: '700' },
});