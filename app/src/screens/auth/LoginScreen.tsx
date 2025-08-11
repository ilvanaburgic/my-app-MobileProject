import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('test@sportin.app');
  const [password, setPassword] = useState('123456');

  const onLogin = async () => {
    //Email form
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Toast.show({
        type: 'error',
        text1: 'Invalid email',
        text2: 'Please enter a valid email like name@example.com'
      });
      return;
    }
    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Wrong password',
        text2: 'Use at least 6 characters'
      });
      return;
    }

    try {
      await login(email.trim(), password);
      navigation.replace('Main');
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Login failed', text2: e?.response?.data?.error || 'Try again' });
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email.trim()) && password.length >= 6;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WELCOME BACK</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} />
      <Button
        title="Login"
        onPress={onLogin}
        style={{ marginTop: 8, width: '100%', opacity: isValid ? 1 : 0.6 }}
        {...({ disabled: !isValid } as any)}
      />
      <Text style={{ marginTop: 10 }}>Don't have account? <Text onPress={() => navigation.navigate('Register')} style={{ fontWeight: '700' }}>Sign up</Text></Text>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  input: { width: '100%', backgroundColor: '#f1eff7', borderRadius: 12, padding: 12, marginBottom: 10 }
});