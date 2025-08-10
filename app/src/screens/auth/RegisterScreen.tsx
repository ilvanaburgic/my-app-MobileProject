import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [name, setName] = useState('New User');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignup = async () => {
    try {
      await register(name, email, password);
      navigation.replace('Main');
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Signup failed', text2: e?.response?.data?.error || 'Try again' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CREATE ACCOUNT</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" style={styles.input} />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} />
      <Button title="Signup" onPress={onSignup} style={{ marginTop: 8, width: '100%' }} />
      <Text style={{ marginTop: 10 }}>Already have account? <Text onPress={() => navigation.navigate('Login')} style={{ fontWeight: '700' }}>Login</Text></Text>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  input: { width: '100%', backgroundColor: '#f1eff7', borderRadius: 12, padding: 12, marginBottom: 10 }
});