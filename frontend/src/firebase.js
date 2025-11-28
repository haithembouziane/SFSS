// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHjZhB_QFMqgt8d4iBDoijFidIkJyv5L4",
  authDomain: "algeria20-d2383.firebaseapp.com",
  projectId: "algeria20-d2383",
  storageBucket: "algeria20-d2383.appspot.com",
  messagingSenderId: "690458776850",
  appId: "1:690458776850:web:b033c609f0895934748fcb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

export default app;
