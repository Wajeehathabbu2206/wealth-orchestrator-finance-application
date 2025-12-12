// Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaMoneyBillWave,
  FaChartPie,
  FaBullseye,
  FaChartBar,
  FaStream,
  FaSignOutAlt,
} from "react-icons/fa";
import { logoutUser } from "../../services/AuthService";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/" },
    { name: "Transactions", icon: <FaMoneyBillWave />, path: "/transactions" },
    { name: "Budgets", icon: <FaChartPie />, path: "/budgets" },
    { name: "Goals", icon: <FaBullseye />, path: "/goals" },
    { name: "Reports", icon: <FaChartBar />, path: "/reports" },
  ];

  const handleLogout = () => {
    logoutUser(); // remove token from localStorage
    navigate("/login"); // redirect to login
    window.location.reload(); // refresh UI and clear cached data
  };

  return (
    <div style={styles.sidebar}>
      {/* Logo / Branding */}
      <div style={styles.logoContainer}>
        <FaStream style={styles.logoIcon} />
        <h2 style={styles.logo}>
          Wealth<br />Orchestrator
        </h2>
      </div>

      {/* Navigation Items */}
      {menuItems.map((item) => (
        <Link key={item.path} to={item.path} style={{ textDecoration: "none" }}>
          <div
            style={{
              ...styles.menuItem,
              ...(location.pathname === item.path ? styles.active : {})
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            {item.name}
          </div>
        </Link>
      ))}

      {/* Logout Button */}
      <button onClick={handleLogout} style={styles.logoutBtn}>
        <FaSignOutAlt style={{ marginRight: "10px" }} />
        Logout
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "230px",
    background: "#0f172a",
    color: "white",
    padding: "25px 20px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    position: "fixed",
    top: 0,
    left: 0
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "35px",
  },
  logoIcon: {
    fontSize: "32px",
    color: "#3b82f6",
    marginRight: "10px",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    lineHeight: "1.3",
    margin: 0,
    whiteSpace: "nowrap",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    color: "#cbd5e1",
    transition: "0.25s",
  },
  icon: {
    marginRight: "12px",
    fontSize: "18px",
  },
  active: {
    background: "#3b82f6",
    color: "#fff",
  },
  logoutBtn: {
    marginTop: "auto",
    background: "transparent",
    border: "1px solid #ef4444",
    padding: "12px 16px",
    padddingBottom: "10px",
    marginBottom: "45px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#ef4444",
    display: "flex",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "bold",
    transition: "0.3s",
  },
};
