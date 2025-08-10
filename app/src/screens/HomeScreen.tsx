import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image, Alert } from 'react-native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const images: Record<string, any> = {
  padel: require('../../assets/Padel_court.jpg'),
  volleyball: require('../../assets/Volleyball_court.jpg'),
  futsal: require('../../assets/Futsal_court.jpg'),
  basketball: require('../../assets/Basketball_court.webp'),
};

export default function HomeScreen({ navigation }: any) {
  const [sports, setSports] = useState<{ id: string; name: string; imageUrl?: string }[]>([]);
  const { user } = useAuth();

  const load = async () => {
    const r = await api.get('/sports');
    setSports(r.data);
  };

  useEffect(() => {
    load();
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const onDelete = (id: string) => {
    Alert.alert('Delete sport', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
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

  const renderImage = (item: { id: string; imageUrl?: string }) => {
    if (item.imageUrl) return { uri: item.imageUrl };
    if (images[item.id]) return images[item.id];
    return require('../../assets/Padel_court.jpg');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {user?.role === 'admin' && (
        <View style={{ marginBottom: 16 }}>
          <Pressable
            style={{ backgroundColor: '#6b5cc6', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
            onPress={() => navigation.getParent()?.navigate('AddSport')}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>+ Add Sport</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={sports}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={renderImage(item)} style={styles.img} resizeMode="cover" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: '700' }}>{item.name} court</Text>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable style={styles.reserve} onPress={() => navigation.navigate('SportInfo', { sport: item.id })}>
                  <Text style={{ color: 'white', fontWeight: '700' }}>Reserve</Text>
                </Pressable>

                {user?.role === 'admin' && (
                  <Pressable style={styles.delete} onPress={() => onDelete(item.id)}>
                    <Text style={{ color: 'white', fontWeight: '700' }}>Delete</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        )
        }
      />
    </View >
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 16, padding: 12, gap: 10, elevation: 1 },
  img: { width: '100%', height: 160, borderRadius: 12 },
  reserve: { backgroundColor: '#6b5cc6', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  delete: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
});
