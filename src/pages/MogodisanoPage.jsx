import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";

import {
  createMogo,
  getMogos,
  contributeToMogo,
} from "../features/mogodisano/mogodisanoService";

import { auth } from "../lib/firebase";

export default function MogodisanoPage() {
  // 🧠 STATE
  const [name, setName] = useState("");
  const [members, setMembers] = useState("");
  const [amount, setAmount] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [mogos, setMogos] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // 🚀 LOAD ON PAGE OPEN
  useEffect(() => {
    loadMogos();
  }, []);

  async function loadMogos() {
    const user = auth.currentUser;
    if (!user) return;

    const data = await getMogos(user.uid);
    setMogos(data);
  }

  // 🏗 CREATE
  async function handleCreate(e) {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    const memberList = members
      ? members.split(",").map(m => m.trim())
      : [];

    // include creator
    const allMembers = [user.email || "You", ...memberList];

    await createMogo({
      name,
      members: allMembers,
      contributionAmount: Number(amount),
      minAmount: Number(min),
      maxAmount: Number(max),
      payoutOrder: allMembers,
      currentTurn: 1,
      nextContributionDate: new Date().toISOString(),
    });

    alert("Mogodisano created!");

    // reset
    setName("");
    setMembers("");
    setAmount("");
    setMin("");
    setMax("");
    setShowForm(false);

    loadMogos();
  }

  // 💰 CONTRIBUTE
  async function handleContribute(mogo) {
    await contributeToMogo(mogo);
    alert("Contribution recorded!");
    loadMogos();
  }

  // 🎨 UI
  return (
    <div className="container">
      <h1>Mogodisano 🔁</h1>

      {/* CREATE BUTTON */}
      <button onClick={() => setShowForm(!showForm)}>
        + Create Mogodisano
      </button>

      <br /><br />

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleCreate}>
          <input
            placeholder="Group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br /><br />

          <input
            placeholder="Members (comma separated)"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
          />
          <br /><br />

          <input
            type="number"
            placeholder="Contribution amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <br /><br />

          <input
            type="number"
            placeholder="Minimum amount"
            value={min}
            onChange={(e) => setMin(e.target.value)}
          />
          <br /><br />

          <input
            type="number"
            placeholder="Maximum amount"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
          <br /><br />

          <button type="submit">Create</button>
        </form>
      )}

      <hr />

      {/* DISPLAY */}
      {mogos.length === 0 && <p>No mogodisano yet...</p>}

      {mogos.map(m => {
        const payout =
          m.members.length * m.contributionAmount;

        const currentUser =
          m.payoutOrder[m.currentTurn - 1];

        return (
          <div key={m.id} style={card}>
            <h3>{m.name}</h3>

            <p>Contribution: R {m.contributionAmount}</p>
            <p>Min: R {m.minAmount}</p>
            <p>Max: R {m.maxAmount}</p>

            <p>Total Payout: R {payout}</p>

            <p>Current Turn: {currentUser}</p>

            <p>
              Next Contribution:{" "}
              {new Date(
                m.nextContributionDate
              ).toLocaleDateString()}
            </p>

            <button onClick={() => handleContribute(m)}>
              Contribute
            </button>
          </div>
        );
      })}

      {/* 🔻 BOTTOM NAV (CORRECT PLACE) */}
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