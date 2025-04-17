// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuAy2yw_KnCU5f5wsRDgshEpxIgPr_HzE",
  authDomain: "potato-heatbox.firebaseapp.com",
  projectId: "potato-heatbox",
  storageBucket: "potato-heatbox.firebasestorage.app",
  messagingSenderId: "449295196929",
  appId: "1:449295196929:web:940dcb4ce5986f59823100"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);