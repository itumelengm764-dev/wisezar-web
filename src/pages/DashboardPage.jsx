import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { logoutUser } from "../features/auth/authService";
import { getUserGoals } from "../features/goals/goalService";
import { getGroups } from "../features/groups/groupService";
import { getVibes } from "../features/vibes/vibesService";
import { useNavigate } from "react-router-dom";
import { getUserTransactions } from "../features/transactions/transactionService";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [total, setTotal] = useState(0);
  const [goalCount, setGoalCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [vibeCount, setVibeCount] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const user = auth.currentUser;
    if (!user) return;

    // 🔥 GET TRANSACTIONS
const txns = await getUserTransactions(user.uid);

// show last 5
setTransactions(txns.slice(-5).reverse());

    // ✅ GOALS (WealthBuilder + AutoSplit)
    const goals = await getUserGoals(user.uid);

    const goalsTotal = goals.reduce(
      (sum, g) => sum + (g.savedAmount || 0),
      0
    );

    setGoalCount(goals.length);

    // ✅ VIBES (C Mzansi)
    const vibes = await getVibes(user.uid);

    const vibesTotal = vibes.reduce(
      (sum, v) => sum + (v.savedAmount || 0),
      0
    );

    setVibeCount(vibes.length);

    // ✅ GROUPS
    const groups = await getGroups(user.uid);
    setGroupCount(groups.length);

    // 💰 FINAL TOTAL
    const totalSaved = goalsTotal + vibesTotal;

    setTotal(totalSaved);
  }

  async function handleLogout() {
    await logoutUser();
    navigate("/");
  }

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Welcome 👋</h2>
        <p>Your Smart Wallet</p>
      </div>

      {/* 💰 TOTAL SAVED */}
      <div className="balance-card">
        <p>Total Saved</p>
        <h1>R {total.toLocaleString()}</h1>
      </div>

      {/* 📊 STATS */}
      <div className="stats">
        <div className="stat-card">
          <p>Goals</p>
          <h2>{goalCount}</h2>
        </div>

        <div className="stat-card">
          <p>Vibes</p>
          <h2>{vibeCount}</h2>
        </div>

        <div className="stat-card">
          <p>Groups</p>
          <h2>{groupCount}</h2>
        </div>
      </div>

      {/* ⚡ QUICK ACTIONS */}
      <div className="actions">
        <button onClick={() => navigate("/goals")}>
          🎯 Smart Goals
        </button>

        <button onClick={() => navigate("/groups")}>
          👥 Stokvel
        </button>

        <button onClick={() => navigate("/mogodisano")}>
          🔁 Mogodisano
        </button>

        <button onClick={() => navigate("/vibes")}>
          🎉 Vibes
        </button>
      </div>

      {/* 🧾 RECENT ACTIVITY */}
<div className="transactions">
  <h3>Recent Activity</h3>

  {transactions.length === 0 && (
    <p>No activity yet...</p>
  )}

  {transactions.map(txn => (
    <div key={txn.id} className="txn">
      <div>
        <strong>+ R {txn.amount}</strong>
        <p>{txn.reference}</p>
      </div>
    </div>
  ))}
</div>

      {/* 🚪 LOGOUT */}
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}