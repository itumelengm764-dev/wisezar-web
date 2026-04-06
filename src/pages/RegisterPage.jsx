import { useState } from "react";
import { registerUser } from "../features/auth/authService";
import { useNavigate } from "react-router-dom";

// 🖼 IMPORT YOUR LOGO
import logo from "../assets/logo.png";

export default function RegisterPage() {
  // 🧠 STATE (form inputs)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // 🚀 HANDLE REGISTER
  async function handleRegister(e) {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await registerUser(name, email, password);
      alert("Account created!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  }

  // 🎨 UI
  return (
    <div style={container}>
      {/* 🟢 LOGO */}
      <img src={logo} alt="WiseZar Logo" style={logoStyle} />

      <h2>Create Account</h2>

      <form onSubmit={handleRegister} style={form}>
        <input
          style={input}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={button} type="submit">
          Register
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        Already have an account?
      </p>

      <button style={linkBtn} onClick={() => navigate("/")}>
        Login
      </button>
    </div>
  );
}

//
// 🎨 STYLES (simple premium look)
//

const container = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  background: "#f5f7fa",
};

const logoStyle = {
  width: 80,
  marginBottom: 20,
};

const form = {
  display: "flex",
  flexDirection: "column",
  width: 300,
};

const input = {
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
};

const button = {
  padding: 12,
  borderRadius: 8,
  border: "none",
  background: "#2E7D32",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const linkBtn = {
  marginTop: 10,
  background: "none",
  border: "none",
  color: "#2E7D32",
  cursor: "pointer",
};