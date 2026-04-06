import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { logoutUser } from "../features/auth/authService";
import { getUserGoals } from "../features/goals/goalService";
import { getGroups } from "../features/groups/groupService";
import { getVibes } from "../features/vibes/vibesService";
import { getUserTransactions } from "../features/transactions/transactionService";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  // 🧠 STATE (stores data)
  const [total, setTotal] = useState(0);
  const [goalCount, setGoalCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [vibeCount, setVibeCount] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // 🚀 LOAD DATA ON START
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const user = auth.currentUser;
    if (!user) return;

    // 📜 TRANSACTIONS
    const txns = await getUserTransactions(user.uid);
    setTransactions(txns.slice(-5).reverse());

    // 🎯 GOALS
    const goals = await getUserGoals(user.uid);
    const goalsTotal = goals.reduce(
      (sum, g) => sum + (g.savedAmount || 0),
      0
    );
    setGoalCount(goals.length);

    // 🎉 VIBES
    const vibes = await getVibes(user.uid);
    const vibesTotal = vibes.reduce(
      (sum, v) => sum + (v.savedAmount || 0),
      0
    );
    setVibeCount(vibes.length);

    // 👥 GROUPS
    const groups = await getGroups(user.uid);
    setGroupCount(groups.length);

    // 💰 TOTAL (combined)
    const totalSaved = goalsTotal + vibesTotal;
    setTotal(totalSaved);
  }

  // 🚪 LOGOUT
  async function handleLogout() {
    await logoutUser();
    navigate("/");
  }

  return (
    <div className="dashboard">

      {/* 🧠 HEADER */}
      <div className="dashboard-header">
        <h2>WiseZar 💰</h2>
        <p>Welcome back</p>
      </div>

      {/* 💰 BALANCE CARD */}
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
          🎯 Goals
        </button>

        <button onClick={() => navigate("/groups")}>
          👥 Groups
        </button>

        <button onClick={() => navigate("/mogodisano")}>
          🔁 Mogodisano
        </button>

        <button onClick={() => navigate("/vibes")}>
          🎉 Vibes
        </button>
      </div>

      {/* 🧾 TRANSACTIONS */}
      <div className="transactions">
        <h3>Recent Activity</h3>

        {transactions.length === 0 && (
          <p>No activity yet...</p>
        )}

        {transactions.map((txn) => (
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