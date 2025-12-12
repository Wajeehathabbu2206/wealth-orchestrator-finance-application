export default function SummaryCard({ title, value, color }) {
  return (
    <div style={{
      background: "#1e293b",
      padding: "20px",
      borderRadius: "12px",
      color: "#fff",
      width: "200px",
      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      borderLeft: `4px solid ${color}`
    }}>
      <h3 style={{ fontSize: "14px", opacity: 0.7 }}>{title}</h3>
      <p style={{ fontSize: "22px", fontWeight: "bold", marginTop: "10px" }}>
        ₹{value.toLocaleString()}
      </p>
    </div>
  );
}
