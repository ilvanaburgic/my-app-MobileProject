import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import api from '../api/client';

export default function AdminScreen() {
  const [rows, setRows] = useState<any[]>([]);
  const load = async () => { const r = await api.get('/reservations'); setRows(r.data); };
  const del = async (id: number) => { await api.delete(`/reservations/${id}`); await load(); };
  useEffect(() => { load(); }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={rows}
        keyExtractor={(i) => String(i.id)}
        ListEmptyComponent={<Text>No reservations.</Text>}
        renderItem={({ item }) => (
          <View style={{ padding: 12, backgroundColor: 'white', borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontWeight: '700' }}>#{item.id} {item.sport.toUpperCase()}</Text>
              <Text>{item.date} — {item.time} (user {item.userId})</Text>
            </View>
            <Pressable onPress={() => del(item.id)} style={{ backgroundColor: '#ef4444', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}>
              <Text style={{ color: 'white', fontWeight: '700' }}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}