import { auth, db } from "../../lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// ✅ REGISTER USER
export async function registerUser(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // Save user profile in Firestore
  await setDoc(doc(db, "users", cred.user.uid), {
    uid: cred.user.uid,
    name,
    email,
    createdAt: new Date().toISOString(),
    // ❌ NO approval field
  });

  return cred.user;
}

// ✅ LOGIN USER (FIXED — NO APPROVAL BLOCK)
export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  // Get user profile
  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) {
    throw new Error("User profile not found");
  }

  const userData = userDoc.data();

  // ✅ REMOVED approval check completely

  return user;
}

// ✅ LOGOUT
export async function logoutUser() {
  await signOut(auth);
}