import { View, Text, FlatList } from 'react-native';

export default function PricingScreen() {
  const rows = [
    { sport: 'padel',      pricePerHour: 30 },
    { sport: 'volleyball', pricePerHour: 20 },
    { sport: 'futsal',     pricePerHour: 25 },
    { sport: 'basketball', pricePerHour: 30 },
  ];

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
