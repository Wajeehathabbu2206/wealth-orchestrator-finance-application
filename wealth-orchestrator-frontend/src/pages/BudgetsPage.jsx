// src/pages/BudgetsPage.jsx
import { useEffect, useState } from "react";
import { fetchBudgets, deleteBudget } from "../services/BudgetService";
import BudgetItem from "../components/budget/BudgetItem";
import AddBudgetModal from "../components/budget/AddBudgetModal";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  
  // Counter used to re-trigger data fetch
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadBudgets = async () => {
    try {
      const data = await fetchBudgets();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading budgets:", error);
    }
  };

  // 🔥 Fetch budgets only when refreshTrigger changes
  useEffect(() => {
    loadBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // 🔥 Listen for transaction updates to auto refresh budgets
  useEffect(() => {
    const handler = () => setRefreshTrigger(prev => prev + 1);
    window.addEventListener("transaction-updated", handler);
    return () => window.removeEventListener("transaction-updated", handler);
  }, []);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id);
      triggerRefresh();
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setBudgetToEdit(null);
    triggerRefresh(); // 🟩 ensure UI updates after add/edit
  };

  return (
    <div className="main-content page-content" style={{ padding: "20px", color: "#e5e7eb" }}>
      <h2 style={{ marginBottom: "16px", fontSize: "24px", fontWeight: "bold", color: "#f9fafb" }}>
        Budgets
      </h2>

      <p style={{ color: "#f9fafbd9", fontSize: "16px" }}>
          Stay on top of your monthly spending and avoid overshooting your limits.
        </p>

      <button onClick={() => setModalOpen(true)} style={styles.addBtn}>
        ➕ Add Budget
      </button>

      <div style={styles.budgetContainer}>
        {budgets.length > 0 ? (
          budgets.map((b) => (
            <BudgetItem
              key={b.id}
              budget={b}
              onEdit={() => {
                setBudgetToEdit(b);
                setModalOpen(true);
              }}
              onDelete={() => handleDelete(b.id)}
            />
          ))
        ) : (
          <p style={{ color: "#9ca3af", marginTop: "20px" }}>No budgets available yet.</p>
        )}
      </div>

      {isModalOpen && (
        <AddBudgetModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          refresh={triggerRefresh}
          budgetToEdit={budgetToEdit}
        />
      )}
    </div>
  );
}

const styles = {
  addBtn: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    gap: "8px",
    alignItems: "center",
    transition: "0.3s",
    marginBottom: "20px",
  },
  budgetContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "15px",
  },
};
