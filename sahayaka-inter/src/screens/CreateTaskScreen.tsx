// src/screens/CreateTaskScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, SafeAreaView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import StyledInput from "../components/StyledInput";
import StyledButton from "../components/StyledButton";
import { db, auth } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  GeoPoint,
} from "firebase/firestore"; // <-- Import GeoPoint
import * as Location from "expo-location"; // <-- Import Location
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

const CreateTaskScreen = ({ navigation }: any) => {
  const { userData } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Household Chores");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  ); // <-- State for location

  // This useEffect hook runs when the screen opens
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Permission to access location was denied."
        );
        return;
      }
      // Get the user's current location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const handlePostTask = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    // Check if location has been found
    if (!location) {
      Alert.alert(
        "Finding Location...",
        "Still determining your location, please wait a moment and try again."
      );
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        category,
        status: "open",
        seekerId: userData?.uid,
        seekerName: userData?.fullName || "Anonymous",
        sahayakId: null,
        createdAt: serverTimestamp(),
        // Add the location as a Firestore GeoPoint
        location: new GeoPoint(
          location.coords.latitude,
          location.coords.longitude
        ),
      });

      Alert.alert("Success", "Your task has been posted!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Post a New Task</Text>

      <StyledInput
        label="Task Title"
        value={title}
        onChangeText={setTitle}
        placeholder="e.g., Grocery Shopping"
      />
      <StyledInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Describe what you need help with."
        multiline
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Household Chores" value="Household Chores" />
          <Picker.Item label="Tech Help" value="Tech Help" />
          <Picker.Item label="Companionship" value="Companionship" />
          <Picker.Item label="Errands" value="Errands" />
        </Picker>
      </View>

      <StyledButton
        title="Post Task"
        onPress={handlePostTask}
        loading={loading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: {
    ...typography.h1,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
  },
  label: {
    ...typography.label,
    marginBottom: 8,
    marginLeft: 5,
    color: colors.text,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
});

export default CreateTaskScreen;
