// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbJEyAy8zgHgU_TGCu2wqju9ffXx1o5vM",
  authDomain: "decruiz-labs.firebaseapp.com",
  projectId: "decruiz-labs",
  storageBucket: "decruiz-labs.firebasestorage.app",
  messagingSenderId: "946630677953",
  appId: "1:946630677953:web:31bd534e92b1e61fbdcb40",
  measurementId: "G-9TQ9588PHZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);