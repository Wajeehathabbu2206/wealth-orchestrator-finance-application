// src/pages/GoalsPage.jsx
import { useEffect, useState } from "react";
import {
  fetchAllGoals,
  deleteGoal,
} from "../services/GoalService";
import AddGoalModal from "../components/goals/AddGoalModal";
import EditGoalModal from "../components/goals/EditGoalModal";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const loadGoals = async () => {
  try {
    const data = await fetchAllGoals();
    const list = Array.isArray(data) ? data : [];
    setGoals(list);
  } catch (err) {
    console.error("Error loading goals:", err);
    setGoals([]);
  }
};

  useEffect(() => {
    loadGoals();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await deleteGoal(id);
      await loadGoals();
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  const progressPercent = (saved, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((saved / target) * 100), 100);
  };

  return (
    <div className="main-content page-content" style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "24px", color: "#f9fafb", fontSize: "24px", fontWeight: "bold" }}>
        Goals
      </h2>

       <p style={{ color: "#f9fafbd9", fontSize: "16px" }}>
          Save consistently and achieve your financial dreams..
        </p>

      <button
        style={{
          background: "#3b82f6",
          color: "#fff",
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
        onClick={() => setAddOpen(true)}
      >
        ➕ Add Goal
      </button>

      <div
        className="cards-container"
        style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
      >
        {goals.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>No goals yet. Add your first goal!</p>
        ) : (
          goals.map((g) => (
            <div
              key={g.id}
              style={{
                background: "#0f172a",
                padding: "20px",
                borderRadius: "12px",
                color: "#fff",
                boxShadow: "0 0 8px rgba(0,0,0,0.4)",
                minWidth: "260px",
              }}
            >
              <h4 style={{ marginBottom: "8px" }}>{g.title}</h4>
              <p style={{ marginBottom: "8px", fontSize: "14px" }}>
                ₹{g.savedAmount} / ₹{g.targetAmount}
              </p>

              <div
                style={{
                  width: "100%",
                  height: "6px",
                  background: "#1e293b",
                  borderRadius: "4px",
                  overflow: "hidden",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: `${progressPercent(g.savedAmount, g.targetAmount)}%`,
                    height: "100%",
                    background: "#10b981",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>

              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>
                Status: {g.status}
              </p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  style={{
                    background: "#22c55e",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedGoal(g);
                    setEditOpen(true);
                  }}
                >
                  ✏
                </button>

                <button
                  style={{
                    background: "#ef4444",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(g.id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AddGoalModal
        isOpen={isAddOpen}
        onClose={() => setAddOpen(false)}
        refresh={loadGoals}
      />

      <EditGoalModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        goal={selectedGoal}
        refresh={loadGoals}
      />
    </div>
  );
}
