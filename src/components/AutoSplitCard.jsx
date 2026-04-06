import { useState } from "react";

export default function AutoSplitCard() {
  const [income, setIncome] = useState(15000);

  // 🧠 CALCULATIONS
  const striker = income * 0.09;
  const emergency = income * 0.05;
  const december = income * 0.03;

  const strikerYear = striker * 12;

  function format(num) {
    return "R " + num.toLocaleString();
  }

  return (
    <div style={card}>
      {/* HEADER */}
      <div style={header}>
        <p style={{ color: "#ccc" }}>
          Build your own 13th cheque
        </p>
      </div>

      {/* SLIDER */}
      <div style={{ marginTop: 20 }}>
        <p>Monthly Income</p>
        <h2>{format(income)}</h2>

        <input
          type="range"
          min="5000"
          max="100000"
          step="500"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
        />
      </div>

      {/* RESULTS */}
      <div style={{ marginTop: 20 }}>
        <div style={row}>
          <span>13th Cheque (9%)</span>
          <strong>{format(striker)}</strong>
        </div>

        <div style={row}>
          <span>Emergency (5%)</span>
          <strong>{format(emergency)}</strong>
        </div>

        <div style={row}>
          <span>December (3%)</span>
          <strong>{format(december)}</strong>
        </div>
      </div>

      {/* YEAR RESULT */}
      <div style={{ marginTop: 20 }}>
        <p>End of Year</p>
        <h2 style={{ color: "#00c853" }}>
          {format(strikerYear)}
        </h2>
      </div>

      {/* CTA */}
      <button style={{ marginTop: 20 }}>
        Start Auto Plan
      </button>
    </div>
  );
}

// STYLES
const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 20,
  marginTop: 20,
};

const header = {
  background: "#111",
  color: "#fff",
  padding: 20,
  borderRadius: 16,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 10,
};