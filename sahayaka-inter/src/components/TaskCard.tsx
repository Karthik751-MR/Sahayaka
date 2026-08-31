// src/components/TaskCard.tsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Card, Title, Paragraph, Chip } from "react-native-paper";
import { MotiView } from "moti";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

interface TaskCardProps {
  item: any;
  onPress: () => void;
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ item, onPress, index }) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 350, delay: index * 50 }}
    >
      <TouchableOpacity onPress={onPress}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.taskTitle}>{item.title}</Title>
            <Chip
              icon={() => (
                <MaterialCommunityIcons
                  name="tag-outline"
                  size={16}
                  color={colors.primary}
                />
              )}
              style={styles.chip}
            >
              {item.category}
            </Chip>
            <Paragraph style={styles.taskSeeker}>
              Posted by: {item.seekerName}
            </Paragraph>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  chip: {
    alignSelf: "flex-start",
    marginBottom: 12,
    backgroundColor: "#e7f0fd",
  },
  taskSeeker: {
    fontSize: 12,
    color: colors.gray,
  },
});

export default React.memo(TaskCard); // Memoize the component for performance
