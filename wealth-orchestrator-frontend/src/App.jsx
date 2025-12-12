// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/common/SideBar";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetsPage from "./pages/BudgetsPage";
import GoalsPage from "./pages/GoalsPage";
import ReportsPage from "./pages/ReportsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/router/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes with Sidebar layout */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <div style={{ display: "flex", background: "#020617" }}>
                <Sidebar />
                <div className="main-content">
                  <OutletWrapper />
                </div>
              </div>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>

        {/* Fallback: if no route matched → redirect to login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

function OutletWrapper() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/budgets" element={<BudgetsPage />} />
      <Route path="/goals" element={<GoalsPage />} />
      <Route path="/reports" element={<ReportsPage />} />
    </Routes>
  );
}

export default App;
