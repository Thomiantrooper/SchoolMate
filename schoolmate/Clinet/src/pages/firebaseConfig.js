import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

// Firebase Configuration
// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCjoqG_rrpx0qKB1wqq2Hc06OjCPx0RfnY",
  authDomain: "schoolmanagementsystem-77516.firebaseapp.com",
  projectId: "schoolmanagementsystem-77516",
  storageBucket: "schoolmanagementsystem-77516.firebasestorage.app",
  messagingSenderId: "335011510224",
  appId: "1:335011510224:web:714cb5e4d09c2e25952bd5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc };
