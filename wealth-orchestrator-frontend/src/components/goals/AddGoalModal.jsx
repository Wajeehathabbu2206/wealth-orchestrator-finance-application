import { useState } from "react";
import { createGoal } from "../../services/GoalService";

export default function AddGoalModal({ isOpen, onClose, refresh }) {
  const [goal, setGoal] = useState({
    title: "",
    targetAmount: "",
    deadline: ""
  });

  const handleSubmit = async () => {
    if (!goal.title || !goal.targetAmount || !goal.deadline) return;

    try {
      await createGoal(goal);
      refresh();
      onClose();
    } catch (err) {
      console.error("Error adding goal:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginBottom: "15px" }}>Add New Goal</h3>

        <input
          type="text"
          placeholder="Goal Name"
          value={goal.title}
          onChange={(e) => setGoal({ ...goal, title: e.target.value })}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Target Amount"
          value={goal.targetAmount}
          onChange={(e) =>
            setGoal({ ...goal, targetAmount: Number(e.target.value) })
          }
          style={inputStyle}
        />

        <input
          type="date"
          value={goal.deadline}
          onChange={(e) =>
            setGoal({ ...goal, deadline: e.target.value })
          }
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button style={btnPrimary} onClick={handleSubmit}>Save</button>
          <button style={btnSecondary} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modalStyle = {
  background: "#0f172a",
  padding: "25px",
  borderRadius: "12px",
  width: "350px",
  color: "#fff",
  boxShadow: "0px 0px 15px rgba(0,0,0,0.4)"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#fff"
};

const btnPrimary = {
  background: "#10b981",
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const btnSecondary = {
  background: "#ef4444",
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
