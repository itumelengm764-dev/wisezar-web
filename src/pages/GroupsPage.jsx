import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";

import {
  createGroup,
  getGroups,
  joinGroup,
  contribute,
} from "../features/groups/groupService";

import { auth } from "../lib/firebase";

export default function GroupsPage() {
  // 🧠 STATE
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");

  const [groups, setGroups] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [showForm, setShowForm] = useState(false);

  // 🚀 LOAD ON PAGE OPEN
  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    const user = auth.currentUser;
    if (!user) return;

    const data = await getGroups(user.uid);
    setGroups(data);
  }

  // 🏗 CREATE GROUP
  async function handleCreate(e) {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    const code = Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();

    await createGroup({
      name,
      admin: {
        uid: user.uid,
        name: user.email || "User",
      },
      members: [
        {
          uid: user.uid,
          name: user.email || "User",
        },
      ],
      groupTarget: Number(target),
      contributionAmount: Number(amount),
      durationMonths: Number(duration),
      totalSaved: 0,
      inviteCode: code,
    });

    alert("Group created! Code: " + code);

    // reset form
    setName("");
    setTarget("");
    setAmount("");
    setDuration("");
    setShowForm(false);

    loadGroups();
  }

  // 🔗 JOIN GROUP
  async function handleJoin() {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await joinGroup(joinCode, user);
      alert("Joined group!");
      setJoinCode("");
      loadGroups();
    } catch (err) {
      alert(err.message);
    }
  }

  // 💰 CONTRIBUTE
  async function handleContribute(group) {
    const input = prompt("Enter amount");
    if (!input) return;

    const user = auth.currentUser;
    if (!user) return;

    await contribute(group, user, Number(input));
    loadGroups();
  }

  // 🎨 UI
  return (
    <div className="container">
      <h1>Stokvel 👥</h1>

      {/* CREATE BUTTON */}
      <button onClick={() => setShowForm(!showForm)}>
        + Create Group
      </button>

      <br /><br />

      {/* CREATE FORM */}
      {showForm && (
        <form onSubmit={handleCreate}>
          <input
            placeholder="Group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br /><br />

          <input
            type="number"
            placeholder="Group target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <br /><br />

          <input
            type="number"
            placeholder="Monthly contribution"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <br /><br />

          <input
            type="number"
            placeholder="Duration (months)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <br /><br />

          <button type="submit">Create</button>
        </form>
      )}

      <hr />

      {/* JOIN GROUP */}
      <h3>Join Group</h3>

      <input
        placeholder="Enter invite code"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
      />

      <br /><br />

      <button onClick={handleJoin}>Join</button>

      <hr />

      {/* DISPLAY GROUPS */}
      {groups.length === 0 && <p>No groups yet...</p>}

      {groups.map(g => {
        const progress =
          g.groupTarget > 0
            ? (g.totalSaved / g.groupTarget) * 100
            : 0;

        return (
          <div key={g.id} style={card}>
            <h3>{g.name}</h3>

            <p>Total Saved: R {g.totalSaved}</p>
            <p>Target: R {g.groupTarget}</p>
            <p>Monthly: R {g.contributionAmount}</p>

            <p>Members:</p>
            {g.members?.map((m, i) => (
              <p key={i}>• {m.name}</p>
            ))}

            <p>Progress: {progress.toFixed(1)}%</p>

            <button onClick={() => handleContribute(g)}>
              Contribute
            </button>
          </div>
        );
      })}

      {/* 🔻 BOTTOM NAV (INSIDE RETURN ✅) */}
      <BottomNav />
    </div>
  );
}

// 🎨 CARD STYLE
const card = {
  background: "#fff",
  padding: 16,
  marginTop: 10,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};