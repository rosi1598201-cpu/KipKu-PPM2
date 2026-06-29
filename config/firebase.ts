import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvLPsgrhfuzaT3ZU6UT7LnzZPaw6Y8UvE",
  authDomain: "kipku-app.firebaseapp.com",
  projectId: "kipku-app",
  storageBucket: "kipku-app.firebasestorage.app",
  messagingSenderId: "387391753950",
  appId: "1:387391753950:android:cc1aa8d81b3cda4882bc4f",
};

const app = initializeApp(firebaseConfig);

// Tambahkan @ts-ignore tepat di atas persistence untuk melewati validasi TypeScript
const auth = initializeAuth(app, {
  // @ts-ignore
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };

