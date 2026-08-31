// src/components/ActiveTasksList.tsx
import React, { useState, useCallback } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { typography } from "../theme/typography";
import ActiveTaskCard from "./ActiveTaskCard"; // We will create this next

const ActiveTasksList = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveTasks = async () => {
    setLoading(true);
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // This query finds tasks where the user is either the seeker OR the sahayak
    const seekerQuery = query(
      collection(db, "tasks"),
      where("seekerId", "==", currentUser.uid),
      where("status", "==", "in_progress")
    );
    const sahayakQuery = query(
      collection(db, "tasks"),
      where("sahayakId", "==", currentUser.uid),
      where("status", "==", "in_progress")
    );

    const [seekerSnapshot, sahayakSnapshot] = await Promise.all([
      getDocs(seekerQuery),
      getDocs(sahayakQuery),
    ]);

    const seekerTasks = seekerSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const sahayakTasks = sahayakSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTasks([...seekerTasks, ...sahayakTasks]);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchActiveTasks();
    }, [])
  );

  if (loading) return null; // Or a skeleton loader

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <ActiveTaskCard item={item} index={index} />
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>You have no active tasks.</Text>
      }
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: { padding: 10 },
  emptyText: {
    ...typography.body,
    textAlign: "center",
    marginTop: 50,
    color: "#aaa",
  },
});

export default ActiveTasksList;
