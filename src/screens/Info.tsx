import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function InfoScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Title */}
        <Text style={styles.header}>Info Section</Text>

        {/* Work Hours */}
        <Text style={styles.sectionTitle}>Work Hours</Text>
        <View style={styles.rowContainer}>
          {[
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ].map((day) => (
            <View key={day} style={styles.row}>
              <Text style={styles.rowText}>{day}</Text>
              <Text style={styles.rowText}>09:00 - 00:00</Text>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <Text style={styles.sectionTitle}>Pricing (per hour)</Text>
        <View style={styles.rowContainer}>
          <View style={styles.row}>
            <Text style={styles.rowText}>Padel:</Text>
            <Text style={styles.rowText}>20 KM</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>Basketball:</Text>
            <Text style={styles.rowText}>15 KM</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>Volleyball:</Text>
            <Text style={styles.rowText}>15 KM</Text>
          </View>
        </View>

        {/* Location */}
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.rowText}>Brodac 1, Sarajevo 71000</Text>

        {/* Contact */}
        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.rowText}>+387 61 234 567</Text>
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
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5E4B8B',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  rowContainer: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rowText: {
    fontSize: 16,
    color: '#333',
  },
});
