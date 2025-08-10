import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const onSave = async () => {
    try {
      await updateUser({ name, email });
      alert('Saved!');
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Failed to save');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {user?.role === 'admin' && <Text style={{ color: '#6b5cc6', fontWeight: '700' }}>ADMIN</Text>}
      <Text style={{ fontWeight: '700', marginBottom: 8 }}>Edit profile</Text>

      <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" style={styles.input} />
      <Button title="Save" onPress={onSave} style={{ marginTop: 6 }} />
      <Button title="Logout" onPress={logout} style={{ marginTop: 12, backgroundColor: '#111827' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#f1eff7', borderRadius: 12, padding: 12, marginBottom: 10 }
});