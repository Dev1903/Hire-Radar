// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDW7s7ciIT9Oa-3ASxx4_6rui7z3M525u0",
  authDomain: "hireradar-6be39.firebaseapp.com",
  projectId: "hireradar-6be39",
  storageBucket: "hireradar-6be39.firebasestorage.app",
  messagingSenderId: "257078787000",
  appId: "1:257078787000:web:35f08add7c5dbd2364ed4d",
  measurementId: "G-5K8PVJRMKH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();