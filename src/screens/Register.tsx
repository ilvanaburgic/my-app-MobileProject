import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

const API_BASE_URL = 'http://localhost:3000/api'; 

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isPasswordStrong = (pass: string) => {
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return strongPasswordRegex.test(pass);
  };

  const handleRegister = useCallback(async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    if (!isPasswordStrong(password)) {
      Alert.alert(
        'Validation Error',
        'Password must be at least 8 characters, include one uppercase letter, one number, and one special character.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
      });

      const data = response.data;
      console.log('Response:', data);

      if (data.success) {
        dispatch(login({ email, token: data.token }));
        Alert.alert('Success', 'Registration successful!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Registration failed', data.message || 'Unknown error.');
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response?.status === 409) {
        Alert.alert('Registration failed', 'User already exists.');
      } else if (error.response?.data?.message) {
        Alert.alert('Registration failed', error.response.data.message);
      } else {
        Alert.alert('Registration failed', 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword, dispatch, navigation]);

  const goToLogin = useCallback(() => {
    navigation.navigate('Login');
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

          <Text style={styles.header}>Create an Account</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor="#888"
          />

          {loading ? (
            <ActivityIndicator size="large" color="#5E4B8B" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          )}

          <View style={styles.loginPromptContainer}>
            <Text style={styles.loginPromptText}>Already have an account? </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.loginPromptLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  image: {
    width: 220,
    height: 160,
    marginBottom: 16,
    marginTop: 32,
  },
  header: {
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginPromptContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginPromptText: {
    fontSize: 14,
    color: '#666',
  },
  loginPromptLink: {
    fontSize: 14,
    color: '#5E4B8B',
    fontWeight: '700',
  },
});
