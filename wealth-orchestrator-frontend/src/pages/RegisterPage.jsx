import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/AuthService";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await register(username, email, password);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch  {
      setError("Username or email already exists");
    }
  };

  return (
    <div style={container}>
      <form onSubmit={handleSubmit} style={card}>
        <h2 style={{ marginBottom: "16px", color: "#f9fafb" }}>Register</h2>
        {error && <p style={{ color: "#ef4444", marginBottom: "10px" }}>{error}</p>}
        {message && <p style={{ color: "#22c55e", marginBottom: "10px" }}>{message}</p>}

        <label style={label}>Username</label>
        <input
          style={input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label style={label}>Email</label>
        <input
          style={input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={label}>Password</label>
        <input
          style={input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" style={btn}>
          Register
        </button>

        <p style={{ marginTop: "10px", fontSize: "14px", color: "#9ca3af" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#3b82f6" }}>Login</Link>
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
  background: "#22c55e",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};
