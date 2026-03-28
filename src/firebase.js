// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFoZgbxpAH0gV_EMebp2XKmbogUtBmeYQ",
  authDomain: "srm-cat.firebaseapp.com",
  projectId: "srm-cat",
  storageBucket: "srm-cat.firebasestorage.app",
  messagingSenderId: "350579381291",
  appId: "1:350579381291:web:dd0e9ac572f84be9cdc66e",
  measurementId: "G-DS6S899KHZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);