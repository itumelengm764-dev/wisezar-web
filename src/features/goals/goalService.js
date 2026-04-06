import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// CREATE GOAL
export async function createGoal(goal) {
  return await addDoc(collection(db, "goals"), {
    ...goal,
    createdAt: new Date().toISOString(),
  });
}

// GET USER GOALS
export async function getUserGoals(userId) {
  const q = query(collection(db, "goals"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// UPDATE GOAL (add money)
import { doc, updateDoc } from "firebase/firestore";

export async function addToGoal(goalId, amount) {
  const goalRef = doc(db, "goals", goalId);

  await updateDoc(goalRef, {
    savedAmount: amount, // we will improve this later
  });
}