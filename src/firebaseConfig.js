// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATMVwcPydDqMjKTKQfVgimwARJvWgg1jY",
  authDomain: "plateup-app-8ec8d.firebaseapp.com",
  projectId: "plateup-app-8ec8d",
  storageBucket: "plateup-app-8ec8d.firebasestorage.app",
  messagingSenderId: "712974412018",
  appId: "1:712974412018:web:9b63c2a6fbe8f893a7886b",
  measurementId: "G-229L0LPZ4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize Firestore
export const db = getFirestore(app);

