import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const courts = [
  {
    name: 'Padel court',
    image: require('../../assets/padelcourt.jpg'),
  },
  {
    name: 'Volleyball court',
    image: require('../../assets/volleyballcourt.jpg'),
  },
  {
    name: 'Football court',
    image: require('../../assets/footballcourt.jpg'),
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleReserve = (court: { name: string; image: any }) => {
    navigation.navigate('Reservations', {
      name: court.name,
      image: Image.resolveAssetSource(court.image).uri,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Welcome to SportIn</Text>
        {courts.map((court, index) => (
          <View key={index} style={styles.card}>
            <Image source={court.image} style={styles.image} />
            <View style={styles.infoRow}>
              <Text style={styles.courtName}>{court.name}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleReserve(court)}
              >
                <Text style={styles.buttonText}>Reserve</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 16,
    color: '#5E4B8B',
  },
  card: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courtName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  button: {
    backgroundColor: '#5E4B8B',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
