import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image } from 'react-native';
import api from '../api/client';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const PLACEHOLDER = require('../../assets/Padel_court.jpg');

export default function HomeScreen({ navigation }: any) {
  const [sports, setSports] = useState<{ id: string; name: string; imageUrl?: string }[]>([]);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const load = async () => {
    const r = await api.get('/sports');
    setSports(r.data);
    setFailed({});
  };


  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const renderImage = (item: { id: string; imageUrl?: string }) => {
    if (!failed[item.id] && item.imageUrl) return { uri: item.imageUrl };
    return PLACEHOLDER;
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>

      <FlatList
        data={sports}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={renderImage(item)}
              style={styles.img}
              resizeMode="cover"
              defaultSource={PLACEHOLDER}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: '700' }}>{item.name} court</Text>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable
                  style={styles.reserve}
                  onPress={() => navigation.navigate('SportInfo', { sport: item.id })}
                >
                  <Text style={{ color: 'white', fontWeight: '700' }}>Reserve</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 16, padding: 12, gap: 10, elevation: 1 },
  img: { width: '100%', height: 160, borderRadius: 12 },
  reserve: { backgroundColor: '#6b5cc6', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
});
