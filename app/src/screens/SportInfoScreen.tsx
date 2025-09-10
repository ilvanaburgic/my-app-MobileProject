import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import { HOURS } from '../utils/date';


type Slot = { time: string; available: boolean };

export default function SportInfoScreen({ route, navigation }: any) {
  const { sport } = route.params;
  const { user } = useAuth();

  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get('/availability', { params: { sport, date } });
      setSlots(r.data.slots);
    } finally {
      setLoading(false);
      setSelectedTime(null);
    }
  }, [sport, date]);

  useEffect(() => { load(); }, [load]);

  const confirm = async () => {
    if (!user || !selectedTime) return;
    try {
      await api.post('/reservations', { userId: user.id, sport, date, time: selectedTime });
      Toast.show({ type: 'success', text1: 'Reservation confirmed', text2: `${date} — ${selectedTime}` });
      navigation.getParent()?.navigate('History');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Try again');
    } finally {
      load();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
          {sport.toUpperCase()} — {date}
        </Text>
        <Calendar
          onDayPress={(d) => setDate(d.dateString)}
          markedDates={{ [date]: { selected: true } }}
          theme={{
            selectedDayBackgroundColor: '#6b5cc6',
            arrowColor: '#6b5cc6',
            todayTextColor: '#6b5cc6',
          }}
        />
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Available time slots</Text>
        <FlatList
          data={slots.length ? slots : HOURS.map(h => ({ time: h, available: false }))}
          keyExtractor={(i) => i.time}
          numColumns={3}
          columnWrapperStyle={{ gap: 8, marginBottom: 8 }}
          refreshing={loading}
          onRefresh={load}
          renderItem={({ item }) => {
            const selected = selectedTime === item.time;
            return (
              <Pressable
                disabled={!item.available}
                onPress={() => setSelectedTime(item.time)}
                style={[
                  styles.slot,
                  !item.available && styles.taken,
                  selected && styles.selected
                ]}
              >
                <Text style={{ fontWeight: '600' }}>{item.time}</Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={<Text>No slots.</Text>}
        />

        <Pressable
          onPress={confirm}
          disabled={!selectedTime}
          style={[styles.reserveBtn, !selectedTime && { opacity: 0.5 }]}
        >
          <Text style={{ color: 'white', fontWeight: '700' }}>
            {selectedTime ? `Confirm ${selectedTime}` : 'Select a time'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#d1fae5',
    borderRadius: 10,
    alignItems: 'center',
  },
  taken: { backgroundColor: '#e5e7eb' },
  selected: { backgroundColor: '#a7f3d0', borderWidth: 2, borderColor: '#34d399' },
  reserveBtn: {
    backgroundColor: '#6b5cc6',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
  },
});
