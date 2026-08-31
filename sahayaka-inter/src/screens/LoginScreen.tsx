// src/screens/LoginScreen.tsx
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
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      // Firebase handles the sign-in magic here
      await signInWithEmailAndPassword(auth, email, password);
      // **Important:** We don't need to navigate here.
      // Our RootNavigator's onAuthStateChanged listener will automatically
      // detect the login and switch to the main AppStack.
    } catch (error: any) {
      // Provide user-friendly error messages
      let errorMessage = "An unknown error occurred.";
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      }
      Alert.alert("Login Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Log in to your Sahayaka account.</Text>

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

      <StyledButton title="Login" onPress={handleLogin} loading={loading} />

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
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
  title: { ...typography.h1, color: colors.text, textAlign: "center" },
  subtitle: {
    ...typography.body,
    color: colors.gray,
    textAlign: "center",
    marginBottom: 40,
  },
  signUpText: { color: colors.primary, textAlign: "center", marginTop: 20 },
});

export default LoginScreen;
