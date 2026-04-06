import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "./components/Header";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import GoalsPage from "./pages/GoalsPage";
import GroupsPage from "./pages/GroupsPage";
import MogodisanoPage from "./pages/MogodisanoPage";
import VibesPage from "./pages/VibesPage";

import ProtectedRoute from "./components/ProtectedRoute";

import logo from "./assets/logo2.png";

export default function App() {
  const [loading, setLoading] = useState(true);

  const location = useLocation(); // 👈 used to control header

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // 🟡 SPLASH SCREEN
  if (loading) {
    return (
      <div className="splash">
        <img src={logo} alt="logo" />
        <h2>WiseZar</h2>
      </div>
    );
  }

  // 🧠 HIDE HEADER ON LOGIN + REGISTER
  const hideHeader =
    location.pathname === "/" ||
    location.pathname === "/register";

  return (
    <>
      {/* ✅ HEADER GLOBAL */}
      {!hideHeader && <Header />}

      {/* ✅ ROUTES */}
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔒 PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <GoalsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <GroupsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mogodisano"
          element={
            <ProtectedRoute>
              <MogodisanoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vibes"
          element={
            <ProtectedRoute>
              <VibesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}