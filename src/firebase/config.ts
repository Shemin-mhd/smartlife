import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration for smartlife-webapp project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAGHq7AemA3hpWVwPaHHUpp7IgUl3k1_WQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smartlife-webapp.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smartlife-webapp",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smartlife-webapp.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "931545251451",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:931545251451:web:37911a245fe45654caecde",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-EHJDVTZJ87"
};

// Check if credentials are set
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey && 
    firebaseConfig.projectId
  );
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : (isFirebaseConfigured() ? initializeApp(firebaseConfig) : null);

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const analytics = app && typeof window !== 'undefined' ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export default app;
