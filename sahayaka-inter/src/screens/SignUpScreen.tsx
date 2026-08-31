// src/screens/SignUpScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import StyledInput from "../components/StyledInput";
import StyledButton from "../components/StyledButton";
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

const SignUpScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"senior" | "student">("student"); // Default to student
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Create the user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: fullName,
        email: email,
        role: role,
        createdAt: new Date(),
        trustScore: 70, // Default starting score
      });

      // Navigate on success (we'll handle this globally later)
      Alert.alert("Success", "Your account has been created!");
    } catch (error: any) {
      Alert.alert("Sign Up Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <StyledInput
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholder="John Doe"
      />
      <StyledInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <StyledInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="********"
        secureTextEntry
      />

      <Text style={styles.roleLabel}>I am a:</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "student" && styles.roleButtonSelected,
          ]}
          onPress={() => setRole("student")}
        >
          <Text
            style={[
              styles.roleText,
              role === "student" && styles.roleTextSelected,
            ]}
          >
            Student
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "senior" && styles.roleButtonSelected,
          ]}
          onPress={() => setRole("senior")}
        >
          <Text
            style={[
              styles.roleText,
              role === "senior" && styles.roleTextSelected,
            ]}
          >
            Senior
          </Text>
        </TouchableOpacity>
      </View>

      <StyledButton title="Sign Up" onPress={handleSignUp} loading={loading} />

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: "center",
    marginBottom: 30,
  },
  roleLabel: { ...typography.label, marginBottom: 10, textAlign: "left" },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  roleButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  roleButtonSelected: { backgroundColor: colors.primary },
  roleText: { color: colors.primary, fontSize: 16 },
  roleTextSelected: { color: colors.white },
  loginText: { color: colors.primary, textAlign: "center", marginTop: 20 },
});

export default SignUpScreen;
