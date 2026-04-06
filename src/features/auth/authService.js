import { auth, db } from "../../lib/firebase";

// Firebase auth
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Firestore
import { doc, setDoc, getDoc } from "firebase/firestore";

// REGISTER
export async function registerUser(name, email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // Save user in Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    status: "pending", // 🔥 IMPORTANT
    createdAt: new Date().toISOString(),
  });

  return user;
}

// LOGIN
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // Get user profile
  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) {
    throw new Error("User profile not found");
  }

  const userData = userDoc.data();

  // 🔒 Approval check
  if (userData.status !== "approved") {
    throw new Error("Your account is pending approval");
  }

  return user;
}

// LOGOUT
export async function logoutUser() {
  await signOut(auth);
}