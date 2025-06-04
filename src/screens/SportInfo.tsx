import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00', '23:00',
];

type SportInfoScreenRouteProp = RouteProp<RootStackParamList, 'SportInfo'>;

export default function SportInfo() {
  const route = useRoute<SportInfoScreenRouteProp>();
  const { name, image } = route.params;

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleReserve = () => {
    if (!selectedSlot) {
      Alert.alert('Error', 'Please select a time slot.');
      return;
    }
    Alert.alert('Success', `Reserved at ${selectedSlot} today!`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Image
        source={{ uri: image }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Time Slots */}
      <Text style={styles.timeSlotTitle}>Reserve for today:</Text>
      <View style={styles.timeSlotContainer}>
        {timeSlots.map((slot) => (
          <TouchableOpacity
            key={slot}
            style={[
              styles.timeSlot,
              selectedSlot === slot && styles.timeSlotSelected,
            ]}
            onPress={() => setSelectedSlot(slot)}
          >
            <Text
              style={[
                styles.timeSlotText,
                selectedSlot === slot && styles.timeSlotTextSelected,
              ]}
            >
              {slot}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reserve Button */}
      <TouchableOpacity style={styles.reserveButton} onPress={handleReserve}>
        <Text style={styles.reserveButtonText}>Reserve</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5E4B8B',
    marginVertical: 16,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  timeSlotTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 16,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  timeSlot: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  timeSlotSelected: {
    backgroundColor: '#5E4B8B',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#000',
  },
  timeSlotTextSelected: {
    color: '#fff',
  },
  reserveButton: {
    backgroundColor: '#5E4B8B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
