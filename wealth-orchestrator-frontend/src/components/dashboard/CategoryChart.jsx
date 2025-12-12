import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import api from "../../services/api"; // 🔥 Uses JWT

const COLORS = ["#3B82F6", "#10B981", "#FBBF24", "#EC4899", "#8B5CF6", "#F59E0B"];

export default function CategoryChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/dashboard/categories");
        setData(
          res.data.map((item) => ({
            category: item.category,
            amount: Math.abs(item.amount), // Always positive for chart
          }))
        );
      } catch (err) {
        console.error("Category chart load failed:", err);
      }
    };
    loadData();
  }, []);

  if (data.length === 0)
    return (
      <p style={{ color: "#94a3b8", textAlign: "center" }}>
        No expense categories yet.
      </p>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ color: "#3B82F6", marginBottom: "20px" }}>
        Spending by Category
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            outerRadius={100}
            innerRadius={60}
            stroke="none"
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `₹${v}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
