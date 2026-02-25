import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDOf5vKxqxg5i9qyoT1BD4NCdW4oCy72vw",
  authDomain: "rollingfsq.firebaseapp.com",
  projectId: "rollingfsq",
  storageBucket: "rollingfsq.firebasestorage.app",
  messagingSenderId: "702805252974",
  appId: "1:702805252974:web:8e0dab936e37a26f69ff7f",
  measurementId: "G-7FYHD4M291",
} as const;

let app: FirebaseApp | undefined;
let analytics: Analytics | undefined;

function initFirebaseApp() {
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseApp() {
  return initFirebaseApp();
}

import { getStorage } from "firebase/storage";
import { getFirestore, type Firestore } from "firebase/firestore";

export function getFirebaseStorage() {
  const app = initFirebaseApp();
  return getStorage(app);
}

let firestore: Firestore | undefined;

export function getFirebaseFirestore() {
  const app = initFirebaseApp();
  if (!firestore) {
    firestore = getFirestore(app);
  }
  return firestore;
}

export function getFirebaseAnalytics() {
  if (typeof window === "undefined") {
    return undefined;
  }
  if (!analytics) {
    const initializedApp = initFirebaseApp();
    analytics = getAnalytics(initializedApp);
  }
  return analytics;
}
