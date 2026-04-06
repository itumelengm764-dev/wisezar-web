import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// CREATE TRANSACTION
export async function createTransaction(txn) {
  return await addDoc(collection(db, "transactions"), {
    ...txn,
    createdAt: new Date().toISOString(),
  });
}

// GET USER TRANSACTIONS
export async function getUserTransactions(userId) {
  const q = query(
    collection(db, "transactions"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}