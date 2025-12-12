import { useEffect, useState } from "react";
import { fetchAllTransactions } from "../../services/TransactionService";

export default function RecentTransactionsList() {
  const [transactions, setTransactions] = useState([]);

 useEffect(() => {
  const load = async () => {
    try {
      const data = await fetchAllTransactions();
      const list = Array.isArray(data) ? data : [];

      const sorted = list
        .filter(t => t.date) // avoid null dates
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(sorted.slice(0, 5));
    } catch (error) {
      console.error("Recent transactions failed:", error);
      setTransactions([]); // Avoid UI crash
    }
  };
  load();
}, []);


  if (transactions.length === 0)
    return (
      <p style={{ color: "#94a3b8", padding: "20px", textAlign: "center" }}>
        No transactions yet.
      </p>
    );

  const formatAmount = (amt, type) => {
    const sign = type === "EXPENSE" ? "-" : "+";
    return `${sign}₹${Math.abs(amt)}`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ color: "#38bdf8", marginBottom: "20px", fontSize: "18px" }}>
        Recent Transactions
      </h3>

      {transactions.map((tx) => (
        <div
          key={tx.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "14px 0",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div>
            <p style={{ color: "#fff", marginBottom: "4px" }}>{tx.title}</p>
            <span style={{ fontSize: "12px", color: "#9CA3AF" }}>
              {new Date(tx.date).toDateString()} • {tx.category}
            </span>
          </div>

          <span
            style={{
              fontWeight: "bold",
              color: tx.type === "EXPENSE" ? "#EF4444" : "#10B981",
            }}
          >
            {formatAmount(tx.amount, tx.type)}
          </span>
        </div>
      ))}
    </div>
  );
}
