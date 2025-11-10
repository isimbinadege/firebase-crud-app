// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYtZZzGNdNRYwXMFsMTpVT4HD3sS4Vyf0",
  authDomain: "fir-crud-app-c8e42.firebaseapp.com",
  projectId: "fir-crud-app-c8e42",
  storageBucket: "fir-crud-app-c8e42.appspot.com", // ✅ fix storage bucket
  messagingSenderId: "809871211191",
  appId: "1:809871211191:web:53cd675e45afec88462b32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);


export const db = getFirestore(app);
