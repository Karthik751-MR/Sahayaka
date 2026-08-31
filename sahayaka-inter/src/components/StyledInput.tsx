
// src/components/StyledInput.tsx
import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../theme/colors';

interface Props extends TextInputProps {
  label: string;
}

const StyledInput: React.FC<Props> = ({ label, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.gray} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: colors.text,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
});

export default StyledInput;
