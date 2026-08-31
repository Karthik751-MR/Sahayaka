// src/components/ActiveTaskCard.tsx
import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Card, Button, Avatar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";
import { doc, updateDoc } from "firebase/firestore"; // Import updateDoc
import { db } from "../../firebaseConfig";

const ActiveTaskCard = ({ item, index }: { item: any; index: number }) => {
  const navigation = useNavigation<any>();
  const { userData } = useAuth();
  const isUserTheSeeker = userData?.uid === item.seekerId;

  // Function to mark the task as complete
  const handleMarkAsComplete = async () => {
    const taskRef = doc(db, "tasks", item.id);
    try {
      await updateDoc(taskRef, {
        status: "completed",
      });
      Alert.alert("Success", "Task marked as complete!");
      // The list will auto-refresh when the user revisits the screen
    } catch (error) {
      Alert.alert("Error", "Could not update the task. Please try again.");
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "timing", duration: 400, delay: index * 100 }}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Avatar.Icon
            size={40}
            icon={
              isUserTheSeeker ? "account-arrow-left" : "account-arrow-right"
            }
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text variant="titleMedium" style={styles.title}>
              {item.title}
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              {isUserTheSeeker
                ? `You are being helped by a Sahayak`
                : `You are helping ${item.seekerName}`}
            </Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            onPress={() => navigation.navigate("Chat", { taskId: item.id })}
          >
            Open Chat
          </Button>
          {/* Only Seniors see this button, and it now works */}
          {isUserTheSeeker && (
            <Button onPress={handleMarkAsComplete}>Mark as Complete</Button>
          )}
        </Card.Actions>
      </Card>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 10,
    backgroundColor: colors.white,
  },
  content: { flexDirection: "row", alignItems: "center" },
  avatar: { backgroundColor: colors.secondary, marginRight: 15 },
  textContainer: { flex: 1 },
  title: { fontFamily: "Poppins-Bold", lineHeight: 22 },
  paragraph: {
    fontFamily: "Poppins-Regular",
    color: colors.gray,
    lineHeight: 18,
  },
});

export default ActiveTaskCard;
