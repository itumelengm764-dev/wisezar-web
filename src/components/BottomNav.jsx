import { useNavigate } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div style={navStyle}>
      <button onClick={() => navigate("/dashboard")}>🏠</button>
      <button onClick={() => navigate("/goals")}>🎯</button>
      <button onClick={() => navigate("/groups")}>👥</button>
      <button onClick={() => navigate("/vibes")}>🎉</button>
    </div>
  );
}

const navStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "space-around",
  padding: 12,
  background: "#fff",
  borderTop: "1px solid #eee",
};