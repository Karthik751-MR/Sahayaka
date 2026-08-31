// src/screens/ProfileScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-paper";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext"; // <-- Import our hook
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

const ProfileScreen = () => {
  // Get user data and loading state directly from our context
  const { userData, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert("Logout Error", error.message);
    }
  };

  // Show a loader from the context while user data is being fetched
  if (loading) {
    return (
      <ActivityIndicator
        style={styles.loader}
        size="large"
        color={colors.primary}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.name}>{userData?.fullName}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{userData?.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Role:</Text>
          <Text style={styles.infoValue}>
            {userData?.role?.charAt(0).toUpperCase() + userData?.role?.slice(1)}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Trust Score:</Text>
          <Text style={styles.trustScore}>{userData?.trustScore}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          buttonColor={colors.danger}
        >
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-between",
    padding: 20,
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileCard: {
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  greeting: {
    ...typography.body,
    color: colors.gray,
    fontFamily: "Poppins-Regular",
  },
  name: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    ...typography.body,
    color: colors.text,
    fontFamily: "Poppins-SemiBold",
  },
  infoValue: {
    ...typography.body,
    color: colors.gray,
    fontFamily: "Poppins-Regular",
  },
  trustScore: {
    ...typography.body,
    color: colors.secondary,
    fontFamily: "Poppins-Bold",
  },
  buttonContainer: { paddingBottom: 20 },
});

export default ProfileScreen;
