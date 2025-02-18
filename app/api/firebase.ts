// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHqOvTKiPBRA4leZEbg1aUQSGUGy7yuZ0",
  authDomain: "admindashboard-3f0f5.firebaseapp.com",
  projectId: "admindashboard-3f0f5",
  storageBucket: "admindashboard-3f0f5.firebasestorage.app",
  messagingSenderId: "764146379373",
  appId: "1:764146379373:web:6f4529e34c6158fdebad64",
  measurementId: "G-9ZS9J6YP6G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
