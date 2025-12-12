import { useEffect, useState } from "react";
import { updateGoal } from "../../services/GoalService";

export default function EditGoalModal({ isOpen, onClose, goal, refresh }) {
  const [updated, setUpdated] = useState(goal);

  useEffect(() => {
    setUpdated(goal);
  }, [goal]);

  const handleUpdate = async () => {
    try {
      await updateGoal(goal.id, updated);
      refresh();
      onClose();
    } catch (err) {
      console.error("Error updating goal:", err);
    }
  };

  if (!isOpen || !goal) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginBottom: "15px" }}>Edit Goal</h3>

        <input
          type="text"
          value={updated.name}
          onChange={(e) =>
            setUpdated({ ...updated, name: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="number"
          value={updated.targetAmount}
          onChange={(e) =>
            setUpdated({ ...updated, targetAmount: parseFloat(e.target.value) })
          }
          style={inputStyle}
        />

        <input
          type="number"
          value={updated.savedAmount}
          onChange={(e) =>
            setUpdated({ ...updated, savedAmount: parseFloat(e.target.value) })
          }
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button style={btnPrimary} onClick={handleUpdate}>Save</button>
          <button style={btnSecondary} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalStyle = {
  background: "#0f172a",
  padding: "25px",
  borderRadius: "12px",
  width: "350px",
  color: "#fff"
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
  background: "#3B82F6",
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
