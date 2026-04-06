import { useState } from "react";
import { loginUser } from "../features/auth/authService";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* LOGO */}
        <img src={logo} className="auth-logo" />

        <h2>Welcome Back</h2>

        {/* FORM */}
        <form onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-button">
            Login
          </button>
        </form>

        {/* LINK */}
        <p className="auth-link">
          Don’t have an account?
        </p>

        <Link to="/register" className="auth-link-btn">
          Sign up
        </Link>

      </div>
    </div>
  );
}