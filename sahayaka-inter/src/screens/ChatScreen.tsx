// src/screens/ChatScreen.tsx
import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { useAuth } from "../context/AuthContext";

const ChatScreen = ({ route }: any) => {
  const { taskId } = route.params; // Get the taskId from navigation
  const { user, userData } = useAuth(); // Get our logged-in user's info
  const [messages, setMessages] = useState<IMessage[]>([]);

  // Listen for new messages in real-time
  useEffect(() => {
    const messagesCollectionRef = collection(db, "tasks", taskId, "messages");
    const q = query(messagesCollectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allMessages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to JS Date
          user: data.user,
        };
      });
      setMessages(allMessages);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [taskId]);

  // Handle sending new messages
  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      const message = newMessages[0];
      const messagesCollectionRef = collection(db, "tasks", taskId, "messages");
      addDoc(messagesCollectionRef, {
        _id: message._id,
        text: message.text,
        createdAt: message.createdAt,
        user: message.user,
      });
    },
    [taskId]
  );

  if (!user || !userData) {
    return null; // Or a loading spinner
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{
        _id: user.uid,
        name: userData.fullName,
      }}
      // You can customize the look and feel here!
      // renderBubble={props => { ... }}
    />
  );
};

export default ChatScreen;
