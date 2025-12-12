// src/pages/ReportsPage.jsx
import "../ChartSetup";
import { useEffect, useState } from "react";
import SummaryCard from "../components/common/SummaryCard";
import {
  fetchReportSummary,
  fetchReportTrends,
  fetchReportCategories,
} from "../services/ReportService";
import IncomeExpenseChart from "../components/reports/IncomeExpenseChart";
import CategoryPieChart from "../components/reports/CategoryPieChart";
import TopCategoriesChart from "../components/reports/TopCategoriesChart";

export default function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("6M");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [s, t, c] = await Promise.all([
          fetchReportSummary(),
          fetchReportTrends(),
          fetchReportCategories(),
        ]);

        setSummary(s);
        setTrends(t || []);
        setCategories(c || []);
      } catch (err) {
        console.error("Error loading reports:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredTrends = (() => {
    if (!trends || trends.length === 0) return [];
    if (period === "3M") return trends.slice(-3);
    if (period === "6M") return trends.slice(-6);
    return trends;
  })();

  return (
    <div className="main-content page-content" style={{ padding: "30px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px", color: "#f9fafb" }}>
        Reports
      </h2>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <p style={{ color: "#f9fafbd9", fontSize: "16px" }}>
          Analyze your income, expenses, and category-wise spending.
        </p>

        <div>
          <label style={{ marginRight: "8px" }}>Period:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              background: "#0f172a",
              color: "#e5e7eb",
              borderRadius: "6px",
              border: "1px solid #1f2937",
              padding: "6px 20px",
            }}
          >
            <option value="3M">Last 3 Months</option>
            <option value="6M">Last 6 Months</option>
            <option value="ALL">All Available</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#fff" }}>Loading reports...</p>
      ) : (
        <>
          {/* Summary Cards */}
          {summary && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "26px",
              }}
            >
              <SummaryCard title="Total Income" value={summary.totalIncome} color="#22c55e" />
              <SummaryCard title="Total Expense" value={summary.totalExpense} color="#ef4444" />
              <SummaryCard title="This Month Spending" value={summary.thisMonthExpense} color="#3b82f6" />
              <SummaryCard title="Total Balance" value={summary.totalBalance} color="#a855f7" />
            </div>
          )}

          {/* Charts Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr",
              gap: "22px",
              marginBottom: "26px",
            }}
          >
            <div style={chartCardStyle}>
              <h3 style={chartTitle}>Income vs Expense</h3>
              <IncomeExpenseChart trends={filteredTrends} />
            </div>

            <div style={chartCardStyle}>
              <h3 style={chartTitle}>Category Breakdown</h3>
              <CategoryPieChart categories={categories} />
            </div>
          </div>

          <div style={chartCardStyle}>
            <h3 style={chartTitle}>Top Spending Categories</h3>
            <TopCategoriesChart categories={categories} />
          </div>
        </>
      )}
    </div>
  );
}

const chartCardStyle = {
  background: "#0f172a",
  borderRadius: "12px",
  padding: "18px",
  boxShadow: "0 0 10px rgba(0,0,0,0.4)",
};

const chartTitle = {
  marginBottom: "12px",
  fontSize: "16px",
  color: "#e5e7eb",
};
