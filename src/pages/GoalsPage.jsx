import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";

import { createGoal, getUserGoals } from "../features/goals/goalService";
import { auth } from "../lib/firebase";

import AutoSplitCard from "../components/AutoSplitCard";

export default function GoalsPage() {
  // 🧠 STATE (memory of your page)
  const [goals, setGoals] = useState([]);

  // 🚀 RUN WHEN PAGE LOADS
  useEffect(() => {
    init();
  }, []);

  // 🔥 STEP 1: Ensure default goal exists
  async function init() {
    const user = auth.currentUser;
    if (!user) return;

    const data = await getUserGoals(user.uid);

    // Check if WealthBuilder already exists
    const exists = data.find(g => g.title === "WealthBuilder");

    if (!exists) {
      await createGoal({
        userId: user.uid,
        title: "WealthBuilder",
        targetAmount: 100000,
        durationMonths: 24,
        savedAmount: 0,
        type: "wealth",
      });
    }

    loadGoals();
  }

  // 🔥 STEP 2: Load goals from Firebase
  async function loadGoals() {
    const user = auth.currentUser;
    if (!user) return;

    const data = await getUserGoals(user.uid);
    setGoals(data);
  }

  // 🧱 UI (what user sees)
  return (
    <div className="container">
      <h1>Smart Goals</h1>

      {/* 🥇 WEALTHBUILDER INTRO */}
      <div style={card}>
        <h2>WealthBuilder 💰</h2>
        <p style={{ color: "#777" }}>
          Save towards R100K+ over 24 months
        </p>
      </div>

      {/* 🥈 AUTO SPLIT (separate component) */}
      <AutoSplitCard />

      <hr />

      {/* 🧾 USER GOALS */}
      <h2>Your Goals</h2>

      {goals.length === 0 && <p>No goals yet...</p>}

      {goals.map(goal => {
        const progress =
          goal.targetAmount > 0
            ? (goal.savedAmount / goal.targetAmount) * 100
            : 0;

        return (
          <div key={goal.id} style={card}>
            <h3>{goal.title}</h3>

            <p>Saved: R {goal.savedAmount}</p>
            <p>Target: R {goal.targetAmount}</p>

            {/* 📊 PROGRESS BAR */}
            <div style={progressBar}>
              <div
                style={{
                  ...progressFill,
                  width: `${progress}%`,
                }}
              />
            </div>

            <p>{progress.toFixed(1)}%</p>
          </div>
        );
      })}

      {/* 🔻 BOTTOM NAV ALWAYS LAST */}
      <BottomNav />
    </div>
  );
}

// 🎨 SIMPLE STYLES (clean UI blocks)
const card = {
  background: "#fff",
  padding: 16,
  marginTop: 10,
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const progressBar = {
  height: 10,
  background: "#eee",
  borderRadius: 10,
  overflow: "hidden",
  marginTop: 10,
};

const progressFill = {
  height: "100%",
  background: "#00c853",
};