import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import api from '../api/client';

const PLACEHOLDER = require('../../assets/Padel_court.jpg');

export default function AdminScreen({ navigation }: any) {
  const [sports, setSports] = useState<{ id: string; name: string; imageUrl?: string }[]>([]);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const load = async () => {
    const r = await api.get('/sports');
    setSports(r.data);
    setFailed({});
  };

  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  const onDelete = (id: string) => {
    Alert.alert('Delete sport', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/sports/${id}`);
            await load();
          } catch (e: any) {
            alert(e?.response?.data?.error || 'Failed to delete');
          }
        }
      },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ marginBottom: 16 }}>
        <Pressable
          style={{ backgroundColor: '#6b5cc6', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
          onPress={() => navigation.navigate('AddSport')}
        >
          <Text style={{ color: 'white', fontWeight: '700' }}>+ Add Sport</Text>
        </Pressable>
      </View>

      <FlatList
        data={sports}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={!failed[item.id] && item.imageUrl ? { uri: item.imageUrl } : PLACEHOLDER}
              style={styles.img}
              resizeMode="cover"
              defaultSource={PLACEHOLDER}
              onError={() => setFailed(f => ({ ...f, [item.id]: true }))}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: '700' }}>{item.name} court</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable
                  style={styles.edit}
                  onPress={() => navigation.navigate('EditSport', {
                    id: item.id,
                    name: item.name,
                    imageUrl: item.imageUrl || '',
                  })}
                >
                  <Text style={{ color: 'white', fontWeight: '700' }}>Edit</Text>
                </Pressable>
                <Pressable style={styles.delete} onPress={() => onDelete(item.id)}>
                  <Text style={{ color: 'white', fontWeight: '700' }}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 16, padding: 12, gap: 10, elevation: 1 },
  img: { width: '100%', height: 160, borderRadius: 12 },
  reserve: { backgroundColor: '#6b5cc6', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  delete: { backgroundColor: '#ef4444', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  edit: { backgroundColor: '#f59e0b', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
});
