import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function MonthlyTrendsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const res = await api.get("/dashboard/trends");
        setData(res.data);
      } catch (err) {
        console.error("Trends fetch failed:", err);
      }
    };
    loadTrends();
  }, []);

  if (data.length === 0)
    return (
      <p style={{ color: "#94a3b8", textAlign: "center" }}>
        No trend data yet.
      </p>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ color: "#3B82F6", marginBottom: "20px" }}>
        Monthly Trends
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(v) => `₹${v}`} />
          <Legend />

          <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} />
          <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
