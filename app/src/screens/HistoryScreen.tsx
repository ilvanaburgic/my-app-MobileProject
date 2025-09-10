import React, { useState, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
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

  
  useFocusEffect(
  useCallback(() => {
    console.log('History user =', user); 
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
          </View>
        )}
      />
    </View>
  ); 
}