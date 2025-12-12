export default function BudgetItem({ budget, onEdit, onDelete }) {
  const percentage = (budget.spentAmount / budget.limitAmount) * 100;

  return (
    <div style={styles.card}>
      <h4 style={{ marginBottom: "6px" }}>{budget.category}</h4>
      <p>₹{budget.spentAmount} / ₹{budget.limitAmount}</p>
      <div style={styles.progressContainer}>
        <div
          style={{
            ...styles.progressFill,
            width: `${percentage}%`,
            background: percentage >= 100 ? "#ef4444" : "#22c55e",
          }}
        />
      </div>

      <div style={styles.actions}>
        <button onClick={() => onEdit(budget)} style={styles.editBtn}>✏️</button>
        <button onClick={() => onDelete(budget.id)} style={styles.deleteBtn}>🗑</button>
      </div>
    </div>
  );
}

const styles = {
  card: {
  background: "#0F172A",
  padding: "16px",
  borderRadius: "12px",
  color: "white",
  width: "280px"
},

  progressContainer: {
  width: "100%",
  height: "8px",
  background: "#334155",
  borderRadius: "8px",
  overflow: "hidden",
  marginTop: "8px",
},

  progressBar: {
   height: "10px",
    borderRadius: "8px",
    marginTop: "10px",
    background: "#1E293B",
    overflow: "hidden",
  },
  progressFill: {
    height: "8px",
    borderRadius: "8px",
    transition: "width 0.3s ease-in-out",
    background: `linear-gradient(90deg, #22c55e, #3b82f6)`
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "10px",
    gap: "10px"
  },
  editBtn: { cursor: "pointer", background: "#3b82f6", border: "none", padding: "6px", borderRadius: "6px" },
  deleteBtn: { cursor: "pointer", background: "#ef4444", border: "none", padding: "6px", borderRadius: "6px" }
};
