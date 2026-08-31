// src/screens/TaskListScreen.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  DocumentData,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import TaskCard from "../components/TaskCard"; // Our new card
import TaskCardSkeleton from "../components/TaskCardSkeleton"; // Our new skeleton

interface Task {
  id: string;
  title: string;
  category: string;
  seekerName: string;
  // Add any other fields you expect on a task object
}

const TaskListScreen = ({ navigation }: any) => {
  const { userData } = useAuth(); // <-- Get user role
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const TASKS_PER_PAGE = 7;

  const scrollY = useSharedValue(0);

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, 50], [1, 0.85], "clamp");
    const opacity = interpolate(scrollY.value, [0, 30], [1, 0], "clamp");
    return { transform: [{ scale }], opacity };
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "tasks"),
        where("status", "==", "open"),
        orderBy("createdAt", "desc"),
        limit(TASKS_PER_PAGE)
      );
      const documentSnapshots = await getDocs(q);
      const tasksList = documentSnapshots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastDoc);
      setTasks(tasksList);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreTasks = async () => {
    if (loadingMore || !lastVisible) return;
    setLoadingMore(true);
    try {
      const q = query(
        collection(db, "tasks"),
        where("status", "==", "open"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(TASKS_PER_PAGE)
      );
      const documentSnapshots = await getDocs(q);
      const newTasks = documentSnapshots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastDoc);
      setTasks((prevTasks) => [...prevTasks, ...newTasks]);
    } catch (error) {
      console.error("Error fetching more tasks: ", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Available Tasks</Text>
        </View>
        {Array.from({ length: 5 }).map((_, index) => (
          <TaskCardSkeleton key={index} />
        ))}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        data={tasks}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <Animated.View style={styles.header}>
            <Animated.Text style={[styles.title, animatedHeaderStyle]}>
              Available Tasks
            </Animated.Text>
            {userData?.role === "senior" && (
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate("CreateTask")}
              >
                <Text style={styles.createButtonText}>+ Post Task</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <TaskCard
            item={item}
            index={index}
            onPress={() =>
              navigation.navigate("TaskDetail", { taskId: item.id })
            }
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No open tasks available.</Text>
        }
        onEndReached={fetchMoreTasks}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginVertical: 20 }}
            />
          ) : null
        }
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={11}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: { ...typography.h1 },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: { color: colors.white, fontFamily: "Poppins-SemiBold" },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: colors.gray,
    fontFamily: "Poppins-Regular",
  },
});

export default TaskListScreen;
