import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrFprbdluy5EkgVKncUlkhIetBH3x9kK8",
  authDomain: "digital-trend-4334a.firebaseapp.com",
  projectId: "digital-trend-4334a",
  storageBucket: "digital-trend-4334a.firebasestorage.app",
  messagingSenderId: "378757629214",
  appId: "1:378757629214:web:48f7fbe770cefbaec8b50f",
  measurementId: "G-7KHE4REE65",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics is only supported in browser
let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

// Helpers for backward compatibility with existing code
export function getFirebaseApp() {
  return app;
}
export function getFirebaseAuth() {
  return auth;
}
export function getFirebaseFirestore() {
  return db;
}
export function getFirebaseStorage() {
  return storage;
}
export { app, auth, db, storage, analytics };
