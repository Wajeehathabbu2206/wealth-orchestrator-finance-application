import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/AuthService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);

      setMessage(
        typeof res === "string"
          ? res
          : "If an account with that email exists, a reset link has been sent."
      );

      setEmail("");
    } catch (err) {
      setError(
        err.response?.data ||
          "Unable to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <form onSubmit={handleSubmit} style={card}>
        <h2 style={{ color: "#f9fafb", marginBottom: "18px" }}>
          Forgot Password
        </h2>

        <p style={description}>
          Enter your registered email address and we'll send you a password
          reset link.
        </p>

        {message && (
          <div style={successBox}>
            {message}
          </div>
        )}

        {error && (
          <div style={errorBox}>
            {error}
          </div>
        )}

        <label style={label}>Email</label>

        <input
          style={input}
          type="email"
          required
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          style={{
            ...btn,
            opacity: loading ? 0.7 : 1,
          }}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p style={footer}>
          Remember your password?{" "}
          <Link to="/login" style={link}>
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#020617",
};

const card = {
  width: "360px",
  background: "#0f172a",
  borderRadius: "12px",
  padding: "28px",
  boxShadow: "0 0 20px rgba(0,0,0,0.4)",
  display: "flex",
  flexDirection: "column",
};

const description = {
  color: "#94a3b8",
  fontSize: "14px",
  marginBottom: "18px",
};

const label = {
  color: "#e5e7eb",
  marginBottom: "6px",
  marginTop: "8px",
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #1f2937",
  background: "#020617",
  color: "#fff",
  marginBottom: "16px",
};

const btn = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#3b82f6",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};

const successBox = {
  background: "#064e3b",
  color: "#d1fae5",
  padding: "10px",
  borderRadius: "6px",
  marginBottom: "15px",
  fontSize: "14px",
};

const errorBox = {
  background: "#7f1d1d",
  color: "#fecaca",
  padding: "10px",
  borderRadius: "6px",
  marginBottom: "15px",
  fontSize: "14px",
};

const footer = {
  marginTop: "18px",
  color: "#94a3b8",
  textAlign: "center",
  fontSize: "14px",
};

const link = {
  color: "#3b82f6",
  textDecoration: "none",
};