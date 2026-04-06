import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

// CREATE MOGODISANO
export async function createMogo(data) {
  return await addDoc(collection(db, "mogodisano"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
}

// GET USER MOGODISANO GROUPS
export async function getMogos(userId) {
  const q = query(
    collection(db, "mogodisano"),
    where("members", "array-contains", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// CONTRIBUTE (OPTIONAL SIMPLE VERSION)
export async function contributeToMogo(mogo) {
  const nextTurn = mogo.currentTurn + 1;

  const ref = doc(db, "mogodisano", mogo.id);

  await updateDoc(ref, {
    currentTurn:
      nextTurn > mogo.members.length ? 1 : nextTurn,
    nextContributionDate: new Date().toISOString(),
  });
}