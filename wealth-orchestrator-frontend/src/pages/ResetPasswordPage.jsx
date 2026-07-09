import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/AuthService";

export default function ResetPasswordPage() {

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {

    if (!success) return;

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };

  }, [success, navigate]);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setSuccess("");

    if (!token) {

      setError("Invalid password reset link.");

      return;

    }

    if (newPassword !== confirmPassword) {

      setError("Passwords do not match.");

      return;

    }

    if (newPassword.length < 8) {

      setError("Password must contain at least 8 characters.");

      return;

    }

    try {

      setLoading(true);

      const response = await resetPassword(token, newPassword);

      setSuccess(response);

      setNewPassword("");

      setConfirmPassword("");

    } catch (err) {

      setError(

        err.response?.data ||

        "Unable to reset password."

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div style={container}>

      <form style={card} onSubmit={handleSubmit}>

        <h2 style={{ color: "#fff", marginBottom: 20 }}>

          Reset Password

        </h2>

        {error && (

          <div style={errorBox}>{error}</div>

        )}

        {success && (

          <div style={successBox}>

            <div>{success}</div>

            <br />

            <div>

              Redirecting to Login in {countdown}...

            </div>

          </div>

        )}

        <label style={label}>

          New Password

        </label>

        <input

          type="password"

          style={input}

          value={newPassword}

          onChange={(e) =>

            setNewPassword(e.target.value)

          }

          required

        />

        <label style={label}>

          Confirm Password

        </label>

        <input

          type="password"

          style={input}

          value={confirmPassword}

          onChange={(e) =>

            setConfirmPassword(e.target.value)

          }

          required

        />

        <button

          style={btn}

          disabled={loading}

        >

          {loading

            ? "Resetting..."

            : "Reset Password"}

        </button>

        <p style={footer}>

          <Link

            style={link}

            to="/login"

          >

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

  background: "#0f172a",

  width: "360px",

  borderRadius: "12px",

  padding: "28px",

  display: "flex",

  flexDirection: "column",

  boxShadow: "0 0 20px rgba(0,0,0,0.45)",

};

const label = {

  color: "#e5e7eb",

  marginBottom: "6px",

  marginTop: "10px",

};

const input = {

  padding: "10px",

  borderRadius: "6px",

  border: "1px solid #1f2937",

  background: "#020617",

  color: "#fff",

  marginBottom: "14px",

};

const btn = {

  marginTop: "8px",

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

};

const errorBox = {

  background: "#7f1d1d",

  color: "#fecaca",

  padding: "10px",

  borderRadius: "6px",

  marginBottom: "15px",

};

const footer = {

  textAlign: "center",

  marginTop: "16px",

};

const link = {

  color: "#3b82f6",

  textDecoration: "none",

};