// src/components/reports/IncomeExpenseChart.jsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function IncomeExpenseChart({ trends }) {
  if (!trends || trends.length === 0) return <p>No trend data.</p>;

  // Convert month string (e.g. "Nov 2025") into a sortable Date
  const parseMonthToDate = (monthStr) => new Date(monthStr + " 1");

  // Sort dynamically for ANY year/months
  const sortedTrends = [...trends].sort(
    (a, b) => parseMonthToDate(a.month) - parseMonthToDate(b.month)
  );

  const labels = sortedTrends.map((t) => t.month);
  const incomeData = sortedTrends.map((t) => t.income);
  const expenseData = sortedTrends.map((t) => t.expense);

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(34, 197, 94, 0.7)", // Green
        borderColor: "#22c55e",
        borderWidth: 2,
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "rgba(239, 68, 68, 0.7)", // Red
        borderColor: "#ef4444",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#e5e7eb" },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `₹${context.raw.toLocaleString("en-IN")}`,
        },
      },
    },
    layout: {
      padding: { top: 10, bottom: 15 },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af", maxRotation: 0 },
        grid: { color: "rgba(55,65,81,0.5)" },
      },
      y: {
        ticks: {
          color: "#9ca3af",
          callback: (value) => "₹" + value.toLocaleString("en-IN"),
        },
        grid: { color: "rgba(55,65,81,0.4)" },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px", paddingBottom: "10px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
