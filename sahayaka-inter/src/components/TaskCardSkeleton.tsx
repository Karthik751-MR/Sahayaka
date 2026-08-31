// src/components/TaskCardSkeleton.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { colors } from "../theme/colors";

const TaskCardSkeleton = () => {
  return (
    <View style={styles.card}>
      <MotiView
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ loop: true, type: "timing", duration: 1000 }}
      >
        <View style={[styles.line, { width: "70%" }]} />
        <View style={[styles.line, { width: "40%" }]} />
        <View
          style={[styles.line, { width: "90%", height: 20, marginTop: 10 }]}
        />
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
  },
  line: {
    height: 10,
    backgroundColor: colors.background,
    borderRadius: 4,
    marginBottom: 8,
  },
});

export default TaskCardSkeleton;
