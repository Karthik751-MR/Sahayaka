// src/components/CompletedTasksList.tsx
import React, { useState, useCallback } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { typography } from "../theme/typography";
import CompletedTaskCard from "./CompletedTaskCard"; // We will create this next

const CompletedTasksList = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedTasks = async () => {
    setLoading(true);
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // The query is almost the same, just checking for 'completed' status
    const seekerQuery = query(
      collection(db, "tasks"),
      where("seekerId", "==", currentUser.uid),
      where("status", "==", "completed")
    );
    const sahayakQuery = query(
      collection(db, "tasks"),
      where("sahayakId", "==", currentUser.uid),
      where("status", "==", "completed")
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
      fetchCompletedTasks();
    }, [])
  );

  if (loading) return null;

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <CompletedTaskCard item={item} index={index} />
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>You have no completed tasks.</Text>
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

export default CompletedTasksList;
