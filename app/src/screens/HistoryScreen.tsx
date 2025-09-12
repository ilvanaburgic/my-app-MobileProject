import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryScreen() {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    const r = await api.get('/reservations', { params: { userId: user.id } });
    setRows(r.data);
  }, [user]);

  const onCancel = (id: number) => {
    Alert.alert('Cancel reservation', 'Are you sure?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/reservations/${id}`); 
            await load();
          } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.error || 'Failed to cancel');
          }
        }
      }
    ]);
  }
  
  
  useFocusEffect(
  useCallback(() => {
    load();
  }, [user])
);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={rows}
        keyExtractor={(i) => String(i.id)}
        ListEmptyComponent={<Text>No reservations yet.</Text>}
        renderItem={({ item }) => (
          <View style={{ padding: 12, backgroundColor: 'white', borderRadius: 12, marginBottom: 8 }}>
            <Text style={{ fontWeight: '700' }}>{item.sport.toUpperCase()}</Text>
            <Text>{item.date} — {item.time}</Text>

            <Pressable
              onPress={() => onCancel(item.id)}
              style={{ marginTop: 20, backgroundColor: '#ef4444', padding: 10, borderRadius: 8, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }}>Cancel</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  ); 
}