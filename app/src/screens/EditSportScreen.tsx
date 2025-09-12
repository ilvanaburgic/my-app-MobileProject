import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator, } from 'react-native';
import api from '../api/client';

type RouteParams = {
  id: string;
  name: string;
  imageUrl?: string;
};

export default function EditSportScreen({ route, navigation }: any) {
  const { id, name: initialName, imageUrl: initialImageUrl = '' } =
    route.params as RouteParams;

  const [name, setName] = useState<string>(initialName || '');
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl || '');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const r = await api.get(`/sports/${id}`);   // REQUIRES backend GET /sports/:id 
        setName(r.data.name || '');
        setImageUrl(r.data.imageUrl || '');
      } catch (e: any) {
        console.log(
          'GET /sports/:id failed (fallback to params)',
          e?.response?.status,
          e?.response?.data || e?.message || e
        );
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, [id]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedImg = imageUrl.trim();

    if (!trimmedName) {
      Alert.alert('Error', 'Enter the name of the sport.');
      return;
    }

    setSaving(true);

    const payload: { name: string; imageUrl?: string } = { name: trimmedName };
    if (trimmedImg !== '') payload.imageUrl = trimmedImg;

    try {
      await api.put(`/sports/${id}`, payload);

      Alert.alert('Saved', 'Sport updated successfully.');
      navigation.goBack();
    } catch (err: any) {
      console.log('PUT /sports error', {
        url: `/sports/${id}`,
        payload,
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });
      Alert.alert('Not saved');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>

      {loading ? (
        <View style={{ marginTop: 24 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <Text style={styles.label}>Sport Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="eg. Padel"
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={styles.label}>Image URL (optional)</Text>
          <TextInput
            value={imageUrl}
            onChangeText={setImageUrl}
            style={styles.input}
            placeholder="https://…"
            autoCapitalize="none"
            keyboardType="url"
            returnKeyType="done"
          />

          <Pressable
            style={[styles.btn, (saving || loading) && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving || loading}
          >
            {saving ? <ActivityIndicator /> : <Text style={styles.btnText}>Save</Text>}
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { fontWeight: '700', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },
  btn: {
    backgroundColor: '#6b5cc6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  btnText: { color: 'white', fontWeight: '700' },
});
