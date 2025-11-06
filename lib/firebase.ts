// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANQbpPR1MOi3PHaACEZr2w2rhSrrFo9JQ",
  authDomain: "a3-terca.firebaseapp.com",
  projectId: "a3-terca",
  storageBucket: "a3-terca.firebasestorage.app",
  messagingSenderId: "310809375577",
  appId: "1:310809375577:web:1de27cc3d18e3f478b5248",
  measurementId: "G-901Y876C7R"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };
