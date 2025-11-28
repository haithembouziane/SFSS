// src/authService.js
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Sign up
export const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);

// Login
export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

// Logout
export const logout = () => signOut(auth);
