import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

export default function Button({
  title, onPress, style, disabled
}: {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, disabled && { opacity: 0.6 }, style]}
    >
      <Text style={styles.txt}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#6b5cc6',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: 'center'
  },
  txt: { color: 'white', fontWeight: '700' }
});