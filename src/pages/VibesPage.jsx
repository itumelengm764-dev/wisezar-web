import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";

import {
  createVibe,
  getVibes,
  addToVibe,
  joinVibe,
} from "../features/vibes/vibesService";

import { auth } from "../lib/firebase";

export default function VibesPage() {
  // 🧠 STATE
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [vibes, setVibes] = useState([]);

  const [joinCode, setJoinCode] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  // 🚀 LOAD DATA
  useEffect(() => {
    loadVibes();
  }, []);

  async function loadVibes() {
    const user = auth.currentUser;
    if (!user) return;

    const data = await getVibes(user.uid);
    setVibes(data);
  }

  // 🏗 CREATE
  async function handleCreate(e) {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    await createVibe(
      {
        name,
        targetAmount: Number(target),
        isGroup,
        inviteCode: inviteCode || null,
      },
      user
    );

    alert("Vibe created!");

    setName("");
    setTarget("");
    setInviteCode("");
    setIsGroup(false);
    setShowForm(false);

    loadVibes();
  }

  // 💰 ADD MONEY
  async function handleAdd(vibe) {
    const input = prompt("Enter amount");
    if (!input) return;

    const user = auth.currentUser;
    if (!user) return;

    await addToVibe(vibe, user, Number(input));
    loadVibes();
  }

  // 🔗 JOIN
  async function handleJoin() {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await joinVibe(joinCode, user);
      alert("Joined vibe!");
      setJoinCode("");
      loadVibes();
    } catch (err) {
      alert(err.message);
    }
  }

  // 🎨 UI
  return (
    <div className="container">
      <h1>C Mzansi Vibes 🎉</h1>

      {/* CREATE BUTTON */}
      <button onClick={() => setShowForm(!showForm)}>
        + Create Vibe
      </button>

      <br /><br />

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleCreate}>
          <input
            placeholder="Vibe name (e.g. Durban Trip)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br /><br />

          <input
            type="number"
            placeholder="Target amount"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <br /><br />

          {/* GROUP TOGGLE */}
          <label>
            <input
              type="checkbox"
              checked={isGroup}
              onChange={() => setIsGroup(!isGroup)}
            />
            Group Saving
          </label>

          <br /><br />

          {/* INVITE CODE */}
          {isGroup && (
            <>
              <input
                placeholder="Invite Code (optional)"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
              <br /><br />
            </>
          )}

          <button type="submit">Save Vibe</button>
        </form>
      )}

      <hr />

      {/* DISPLAY */}
      {vibes.length === 0 && <p>No vibes yet...</p>}

      {vibes.map(v => {
        const progress =
          v.targetAmount > 0
            ? (v.savedAmount / v.targetAmount) * 100
            : 0;

        return (
          <div key={v.id} style={card}>
            <h3>{v.name}</h3>

            <p>Type: {v.isGroup ? "Group 👥" : "Solo 🎯"}</p>

            {v.isGroup && v.inviteCode && (
              <p>Invite Code: {v.inviteCode}</p>
            )}

            <p>Target: R {v.targetAmount}</p>
            <p>Saved: R {v.savedAmount}</p>

            <p>Progress: {progress.toFixed(1)}%</p>

            {/* MEMBERS */}
            <p>Members:</p>
            {(v.members || []).map((m, i) => (
              <p key={i}>• {m.name}</p>
            ))}

            <button onClick={() => handleAdd(v)}>
              Add Money
            </button>
          </div>
        );
      })}

      <hr />

      {/* JOIN */}
      <h3>Join a Vibe</h3>

      <input
        placeholder="Enter invite code"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
      />

      <br /><br />

      <button onClick={handleJoin}>
        Join Vibe
      </button>

      {/* 🔻 NAV (CORRECT PLACE) */}
      <BottomNav />
    </div>
  );
}

// 🎨 STYLE
const card = {
  background: "#fff",
  padding: 16,
  marginTop: 10,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};