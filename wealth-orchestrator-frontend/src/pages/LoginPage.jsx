import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/AuthService";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Login clicked!");

    try {
      const data = await login(identifier, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      navigate("/");
    } catch (err) {
      setError("Invalid username/email or password");
    }
  };

  return (
    <div style={container}>
      <form onSubmit={handleSubmit} style={card}>
        <h2 style={{ marginBottom: "16px", color: "#f9fafb" }}>Login</h2>
        {error && <p style={{ color: "#ef4444", marginBottom: "10px" }}>{error}</p>}

        <label style={label}>Username / Email</label>
        <input
          style={input}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <label style={label}>Password</label>
        <input
          style={input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" style={btn}>
          Login
        </button>

        <p style={{ marginTop: "10px", fontSize: "14px", color: "#9ca3af" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#3b82f6" }}>Register</Link>
        </p>
      </form>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#020617",
};

const card = {
  background: "#0f172a",
  padding: "24px",
  borderRadius: "12px",
  width: "320px",
  boxShadow: "0 0 20px rgba(0,0,0,0.5)",
  display: "flex",
  flexDirection: "column",
};

const label = {
  marginTop: "8px",
  marginBottom: "4px",
  fontSize: "13px",
  color: "#e5e7eb",
};

const input = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #1f2937",
  background: "#020617",
  color: "#f9fafb",
  marginBottom: "8px",
};

const btn = {
  marginTop: "14px",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#3b82f6",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};
