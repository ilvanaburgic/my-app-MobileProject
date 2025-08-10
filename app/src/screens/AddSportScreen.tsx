import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import api from '../api/client';

export default function AddSportScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return alert('Enter sport name');
    try {
      await api.post('/sports', { name, imageUrl });
      setName('');
      setImageUrl('');
      alert('Sport added!');
      navigation.goBack();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Error adding sport');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sport Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Image URL (optional)</Text>
      <TextInput value={imageUrl} onChangeText={setImageUrl} style={styles.input} />

      <Pressable style={styles.btn} onPress={handleAdd}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Add Sport</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: '700', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginTop: 4 },
  btn: { backgroundColor: '#6b5cc6', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 20 },
});