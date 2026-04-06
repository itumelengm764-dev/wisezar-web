// Import Firebase core
import { initializeApp } from "firebase/app";

// Import services
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Config
const firebaseConfig = {
  apiKey: "AIzaSyB5wx9d0IY7RUgycaI1tSEAOyFl1nQvXGY",
  authDomain: "wisezar-mvp-339b3.firebaseapp.com",
  projectId: "wisezar-mvp-339b3",
  storageBucket: "wisezar-mvp-339b3.firebasestorage.app",
  messagingSenderId: "404901440753",
  appId: "1:404901440753:web:4a91b3a31ec1e3b03dcd50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT THESE (THIS WAS MISSING)
export const auth = getAuth(app);
export const db = getFirestore(app);