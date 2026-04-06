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

/*
🧠 GROUP STRUCTURE

{
  id,
  name,
  admin: { uid, name },
  members: [{ uid, name }],
  groupTarget,
  contributionAmount,
  durationMonths,
  totalSaved,
  inviteCode,
  createdAt
}
*/

// ✅ CREATE GROUP
export async function createGroup(group) {
  return await addDoc(collection(db, "groups"), {
    ...group,
    totalSaved: 0,
    createdAt: new Date().toISOString(),
  });
}

// ✅ GET USER GROUPS
export async function getGroups(userId) {
  const snapshot = await getDocs(collection(db, "groups"));

  const groups = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  // 🔥 only return groups where user is a member
  return groups.filter(g =>
    (g.members || []).some(m => m.uid === userId)
  );
}

// ✅ JOIN GROUP (BY INVITE CODE)
export async function joinGroup(inviteCode, user) {
  const q = query(
    collection(db, "groups"),
    where("inviteCode", "==", inviteCode)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Invalid invite code");
  }

  const docSnap = snapshot.docs[0];
  const group = docSnap.data();

  const ref = doc(db, "groups", docSnap.id);

  // 🔒 prevent duplicate join
  const exists = (group.members || []).find(
    m => m.uid === user.uid
  );

  if (exists) {
    throw new Error("Already in group");
  }

  const updatedMembers = [
    ...(group.members || []),
    {
      uid: user.uid,
      name: user.email || "User",
    },
  ];

  await updateDoc(ref, {
    members: updatedMembers,
  });
}

// ✅ CONTRIBUTE TO GROUP
export async function contribute(group, user, amount) {
  const ref = doc(db, "groups", group.id);

  const newTotal = (group.totalSaved || 0) + amount;

  await updateDoc(ref, {
    totalSaved: newTotal,
  });
}