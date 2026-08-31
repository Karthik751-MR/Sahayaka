// src/components/StyledButton.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { colors } from "../theme/colors";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

const StyledButton: React.FC<Props> = ({ title, onPress, loading }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StyledButton;
