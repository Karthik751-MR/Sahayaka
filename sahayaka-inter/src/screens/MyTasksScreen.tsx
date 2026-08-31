// src/screens/MyTasksScreen.tsx
import React, { useState } from "react";
import { useWindowDimensions, StyleSheet, Text } from "react-native";
import {
  TabView,
  SceneMap,
  TabBar,
  SceneRendererProps,
  NavigationState,
} from "react-native-tab-view";
import { colors } from "../theme/colors";
import ActiveTasksList from "../components/ActiveTasksList";
import CompletedTasksList from "../components/CompletedTasksList";

const renderScene = SceneMap({
  active: ActiveTasksList,
  completed: CompletedTasksList,
});

// Define the type for our route object
type Route = {
  key: string;
  title: string;
};

const MyTasksScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    { key: "active", title: "Active" },
    { key: "completed", title: "Completed" },
  ]);

  const renderTabBar = (
    props: SceneRendererProps & { navigationState: NavigationState<Route> }
  ) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{ backgroundColor: colors.white }}
      // Add the explicit types for the destructured arguments here
      renderLabel={({ route, focused }: { route: Route; focused: boolean }) => (
        <Text
          style={[
            styles.label,
            { color: focused ? colors.primary : colors.gray },
          ]}
        >
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    textTransform: "capitalize",
  },
});

export default MyTasksScreen;
