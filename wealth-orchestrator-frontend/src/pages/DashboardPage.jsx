// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import SummaryCard from "../components/common/SummaryCard";
import { fetchDashboardSummary } from "../services/DashboardService";
import CategoryChart from "../components/dashboard/CategoryChart";
import MonthlyTrendsChart from "../components/dashboard/MonthlyTrendsChart";
import RecentTransactionsList from "../components/transactions/RecentTransactionsList";
import AddTransactionModal from "../components/transactions/AddTransactionModal";
import AIInsightsPanel from "../components/ai/AIInsightsPanel";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const refreshData = () =>
    fetchDashboardSummary()
      .then(setSummary)
      .catch(console.error);

  useEffect(() => {
    refreshData();

    // 🔥 Listen for updates from transaction modal
    const updateListener = () => refreshData();

    window.addEventListener("transaction-updated", updateListener);

    return () => {
      window.removeEventListener("transaction-updated", updateListener);
    };
  }, []);

  return (
    <div style={{ padding: "30px", color: "#ffffff" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#f9fafb" }}>
        Dashboard Overview
      </h2>

      <p style={{ color: "#f9fafbd9", fontSize: "16px" }}>
          Your financial overview at a glance.
        </p>

      <div style={{ display: "flex", gap: "12px", marginTop: "20px", marginBottom: "20px" }}>
        <button onClick={() => setShowTransactionModal(true)} style={btnStyle("#3b82f6")}>
          + Add Transaction
        </button>
      </div>

      {summary && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "10px",
            marginBottom: "20px",
          }}
        >
          <SummaryCard title="Total Income" value={summary.totalIncome} color="#22c55e" />
          <SummaryCard title="Total Expense" value={summary.totalExpense} color="#ef4444" />
          <SummaryCard title="This Month Spending" value={summary.thisMonthExpense} color="#3b82f6" />
          <SummaryCard title="Balance" value={summary.totalBalance} color="#a855f7" />
        </div>
      )}

      {summary ? <AIInsightsPanel /> : <p style={{ color: "#aaa" }}>Add a transaction to view insights.</p>}

      {summary && (
        <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
          <div style={{ flex: 1, background: "#0F172A", borderRadius: "12px", padding: "10px" }}>
            <CategoryChart />
          </div>
          <div style={{ flex: 1, background: "#0F172A", borderRadius: "12px", padding: "10px" }}>
            <MonthlyTrendsChart />
          </div>
        </div>
      )}

      {summary && (
        <div style={{ background: "#0F172A", borderRadius: "12px", marginTop: "30px" }}>
          <RecentTransactionsList />
        </div>
      )}

      {showTransactionModal && (
        <AddTransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          refresh={refreshData}
        />
      )}
    </div>
  );
}

const btnStyle = (bg) => ({
  background: bg,
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
});
