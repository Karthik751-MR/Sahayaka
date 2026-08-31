// src/screens/TaskDetailScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import StyledButton from "../components/StyledButton";
import { db, auth } from "../../firebaseConfig";
import { doc, getDoc, runTransaction, DocumentData } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

const TaskDetailScreen = ({ route, navigation }: any) => {
  const { taskId } = route.params;
  const { userData } = useAuth(); // Get the current user's role and data
  const [taskData, setTaskData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const taskDocRef = doc(db, "tasks", taskId);
        const taskDocSnap = await getDoc(taskDocRef);
        if (taskDocSnap.exists()) {
          setTaskData(taskDocSnap.data());
        } else {
          Alert.alert("Error", "Task not found.");
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  const handleAcceptTask = async () => {
    setIsAccepting(true);
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "You must be logged in to accept tasks.");
      setIsAccepting(false);
      return;
    }

    const taskRef = doc(db, "tasks", taskId);

    try {
      // Use a transaction to safely update the task. This prevents two
      // users from accepting the same task at the same time.
      await runTransaction(db, async (transaction) => {
        const taskDoc = await transaction.get(taskRef);
        if (!taskDoc.exists()) {
          throw "Error: Task no longer exists.";
        }
        if (taskDoc.data().status !== "open") {
          throw "Sorry, this task has just been accepted by someone else.";
        }
        transaction.update(taskRef, {
          status: "in_progress",
          sahayakId: user.uid,
        });
      });

      Alert.alert(
        "Success!",
        "You have accepted the task. The seeker will be notified."
      );
      navigation.goBack();
    } catch (error: any) {
      console.error("Transaction failed: ", error);
      Alert.alert("Could not accept task", error.toString());
    } finally {
      setIsAccepting(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.loader}
        size="large"
        color={colors.primary}
      />
    );
  }

  if (!taskData) {
    return (
      <View style={styles.container}>
        <Text>Task could not be loaded.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
    >
      <View style={styles.card}>
        <Text style={styles.category}>{taskData.category}</Text>
        <Text style={styles.title}>{taskData.title}</Text>
        <Text style={styles.postedBy}>Posted by: {taskData.seekerName}</Text>

        <View style={styles.separator} />

        <Text style={styles.descriptionLabel}>Details</Text>
        <Text style={styles.description}>{taskData.description}</Text>

        {/* Display the map if location data exists */}
        {taskData.location && (
          <>
            <Text style={styles.descriptionLabel}>Location</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: taskData.location.latitude,
                longitude: taskData.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              pitchEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={taskData.location} title="Task Location" />
            </MapView>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {/* Button for Students to accept an open task */}
        {userData?.role === "student" && taskData.status === "open" && (
          <StyledButton
            title="I Can Help!"
            onPress={handleAcceptTask}
            loading={isAccepting}
          />
        )}

        {/* Button for BOTH users to chat after task is in progress */}
        {taskData.status === "in_progress" &&
          (userData?.uid === taskData.seekerId ||
            userData?.uid === taskData.sahayakId) && (
            <StyledButton
              title="Open Chat"
              onPress={() => navigation.navigate("Chat", { taskId: taskId })}
            />
          )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: colors.white,
    padding: 20,
    margin: 20,
    marginBottom: 0, // Remove bottom margin to let button container handle spacing
    borderRadius: 10,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: 5,
    fontFamily: "Poppins-Bold",
  },
  category: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 15,
    fontFamily: "Poppins-SemiBold",
  },
  postedBy: { ...typography.label, fontStyle: "italic", marginBottom: 20 },
  separator: { height: 1, backgroundColor: "#eee", marginVertical: 15 },
  descriptionLabel: {
    ...typography.h2,
    fontSize: 18,
    color: colors.text,
    marginBottom: 10,
    fontFamily: "Poppins-SemiBold",
  },
  description: {
    ...typography.body,
    color: colors.gray,
    lineHeight: 22,
    marginBottom: 20,
  },
  buttonContainer: { padding: 20, paddingTop: 10 },
  map: {
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default TaskDetailScreen;
