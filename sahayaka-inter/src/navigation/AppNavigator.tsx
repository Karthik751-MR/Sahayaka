// src/navigation/AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";


// Import Screens
import ProfileScreen from "../screens/ProfileScreen";
import TaskListScreen from "../screens/TaskListScreen";
import CreateTaskScreen from "../screens/CreateTaskScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import ChatScreen from "../screens/ChatScreen";
import MyTasksScreen from "../screens/MyTasksScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// The Tab navigator component
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.gray,
    }}
  >
    <Tab.Screen
      name="TaskList"
      component={TaskListScreen}
      options={{
        title: "Tasks",
        headerShown: false, // Use custom header in the screen
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="format-list-bulleted"
            color={color}
            size={size}
          />
        ),
      }}
    />
    <Tab.Screen
      name="MyTasks"
      component={MyTasksScreen}
      options={{
        title: "My Tasks",
        headerTitle: "My Tasks",
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="briefcase-check-outline"
            color={color}
            size={size}
          />
        ),
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileScreen}
      options={{
        title: "Profile",
        headerTitle: "My Profile",
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="account-circle-outline"
            color={color}
            size={size}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

// The Stack navigator component that includes tabs and other screens
const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Main"
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
    />
    <Stack.Screen
      name="CreateTask"
      component={CreateTaskScreen}
      options={{ title: "Post a New Task", presentation: "modal" }}
    />
    <Stack.Screen
      name="TaskDetail"
      component={TaskDetailScreen}
      options={{ title: "Task Details" }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
