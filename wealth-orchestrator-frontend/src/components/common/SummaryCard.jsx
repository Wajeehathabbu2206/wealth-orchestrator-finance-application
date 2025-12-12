// src/components/common/SummaryCard.jsx
export default function SummaryCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "#0f172a",
        padding: "18px",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.4)",
        borderLeft: `4px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100px",
      }}
    >
      <span style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "6px" }}>
        {title}
      </span>

      <strong style={{ fontSize: "22px", fontWeight: "bold", color: "#fff" }}>
        ₹{Number(value || 0).toLocaleString("en-IN")}
      </strong>
    </div>
  );
}
