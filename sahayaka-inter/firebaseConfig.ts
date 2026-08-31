import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Import the new auth modules
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCGD0fnGevW9IyRXKPbLhdGbb3rYeLNDrM",
  authDomain: "sahayaka-app-2a3b0.firebaseapp.com",
  projectId: "sahayaka-app-2a3b0",
  storageBucket: "sahayaka-app-2a3b0.firebasestorage.app",
  messagingSenderId: "161630979961",
  appId: "1:161630979961:web:928b9c98601dde0b5711a8",
  measurementId: "G-0FC1SESHCE",
};
// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Export the services
export { auth, db };
