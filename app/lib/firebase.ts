// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYtZZzGNdNRYwXMFsMTpVT4HD3sS4Vyf0",
  authDomain: "fir-crud-app-c8e42.firebaseapp.com",
  projectId: "fir-crud-app-c8e42",
  storageBucket: "fir-crud-app-c8e42.firebasestorage.app",
  messagingSenderId: "809871211191",
  appId: "1:809871211191:web:53cd675e45afec88462b32",
  measurementId: "G-636B8KG5B7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);