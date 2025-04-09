import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgNl73mot-7KGg0Q3_1_N56bKxmwB5d9E",
  authDomain: "school-sliit.firebaseapp.com",
  projectId: "school-sliit",
  storageBucket: "school-sliit.firebasestorage.app",
  messagingSenderId: "463589008631",
  appId: "1:463589008631:web:7a0e493fea2c2d66569ff2"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc };
