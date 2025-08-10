import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import api from '../api/client';

export default function PricingScreen() {
  const [rows, setRows] = useState<{ sport: string; pricePerHour: number }[]>([]);
  useEffect(() => { api.get('/pricing').then(r => setRows(r.data)); }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={rows}
        keyExtractor={(i) => i.sport}
        renderItem={({ item }) => (
          <View style={{ padding: 12, backgroundColor: 'white', borderRadius: 12, marginBottom: 8 }}>
            <Text style={{ fontWeight: '700' }}>{item.sport.toUpperCase()}</Text>
            <Text>{item.pricePerHour} KM / hour</Text>
          </View>
        )}
      />
    </View>
  );
}