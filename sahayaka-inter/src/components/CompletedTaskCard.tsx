// src/components/CompletedTaskCard.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Button, Avatar, Text } from "react-native-paper";
import { MotiView } from "moti";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

const CompletedTaskCard = ({ item, index }: { item: any; index: number }) => {
  const { userData } = useAuth();
  const isUserTheSeeker = userData?.uid === item.seekerId;

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 500, delay: index * 100 }}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Avatar.Icon size={40} icon="check-decagram" style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              Task completed
            </Text>
          </View>
        </Card.Content>
        {isUserTheSeeker && (
          <Card.Actions>
            <Button
              onPress={() => {
                /* Logic for leaving a review comes here */
              }}
            >
              Leave a Review
            </Button>
          </Card.Actions>
        )}
      </Card>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 10,
    backgroundColor: colors.white,
    opacity: 0.8,
  },
  content: { flexDirection: "row", alignItems: "center" },
  avatar: { backgroundColor: "#5cb85c", marginRight: 15 }, // Green for completed
  textContainer: { flex: 1 },
  title: { fontFamily: "Poppins-Bold", lineHeight: 22 },
  paragraph: {
    fontFamily: "Poppins-Regular",
    color: colors.gray,
    lineHeight: 18,
  },
});

export default CompletedTaskCard;
