// src/navigation/RootNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useAuth } from "../context/AuthContext"; // <-- Use our new hook
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import { ActivityIndicator, View } from "react-native";

const RootNavigator = () => {
  const { user, loading: authLoading } = useAuth(); // <-- Get state from context

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  // Show a loading spinner until both auth and fonts are ready
  if (authLoading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
