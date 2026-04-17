import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const requiredEnvKeys = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

export const missingFirebaseEnv = requiredEnvKeys.filter((key) => !process.env[key]);
export const isFirebaseConfigured = missingFirebaseEnv.length === 0;

let authInstance: Auth | null = null;

// Do not initialize Firebase in server prerender, and avoid crashing if env is missing.
if (typeof window !== "undefined" && isFirebaseConfigured) {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  authInstance = getAuth(app);

  if (firebaseConfig.measurementId) {
    try {
      getAnalytics(app);
    } catch {
      // Analytics is optional and should never block auth.
    }
  }
}

if (typeof window !== "undefined" && !isFirebaseConfigured) {
  console.warn(
    `[EcoBay] Missing Firebase env vars: ${missingFirebaseEnv.join(", ")}`
  );
}

export const auth = authInstance;