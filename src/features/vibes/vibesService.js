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
🧠 DATA STRUCTURE NOW:
members: [
  { uid: "123", name: "John" }
]
*/

// CREATE VIBE
export async function createVibe(vibe, user) {
  return await addDoc(collection(db, "vibes"), {
    ...vibe,
    savedAmount: 0,

    // 🔥 CREATOR IS FIRST MEMBER
    members: [
      {
        uid: user.uid,
        name: user.email || "User",
      },
    ],

    createdAt: new Date().toISOString(),
  });
}

// GET USER VIBES (FILTER BY MEMBER UID)
export async function getVibes(userId) {
  const snapshot = await getDocs(collection(db, "vibes"));

  const vibes = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  // 🔥 FILTER ONLY USER VIBES
  return vibes.filter(v =>
    (v.members || []).some(m => m.uid === userId)
  );
}

// ADD MONEY
export async function addToVibe(vibe, user, amount) {
  const ref = doc(db, "vibes", vibe.id);

  const newTotal = (vibe.savedAmount || 0) + amount;

  await updateDoc(ref, {
    savedAmount: newTotal,
  });
}

// JOIN VIBE
export async function joinVibe(inviteCode, user) {
  const q = query(
    collection(db, "vibes"),
    where("inviteCode", "==", inviteCode)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Invalid invite code");
  }

  const docSnap = snapshot.docs[0];
  const vibe = docSnap.data();

  const ref = doc(db, "vibes", docSnap.id);

  // 🔥 CHECK IF ALREADY MEMBER
  const exists = (vibe.members || []).find(
    m => m.uid === user.uid
  );

  if (exists) {
    throw new Error("Already joined");
  }

  const updatedMembers = [
    ...(vibe.members || []),
    {
      uid: user.uid,
      name: user.email || "User",
    },
  ];

  await updateDoc(ref, {
    members: updatedMembers,
  });
}