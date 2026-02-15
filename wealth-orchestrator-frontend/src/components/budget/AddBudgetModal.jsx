import { useState, useEffect } from "react";
import { addBudget, updateBudget } from "../../services/BudgetService";
import { toast } from "react-toastify";

export default function AddBudgetModal({ isOpen, onClose, refresh, budgetToEdit }) {
  const [formData, setFormData] = useState({
    category: "",
    limitAmount: "",
  });

  //  Load edit data safely
  useEffect(() => {
    if (!isOpen) return; // Prevent double triggers

    if (budgetToEdit) {
      setFormData({
        category: budgetToEdit.category || "",
        limitAmount: budgetToEdit.limitAmount || "",
      });
    } else {
      setFormData({ category: "", limitAmount: "" });
    }
  }, [budgetToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category.trim()) {
      return toast.warning("Category required!");
    }
    if (!formData.limitAmount || formData.limitAmount <= 0) {
      return toast.warning("Limit must be > 0!");
    }

    const payload = {
      category: formData.category.trim(),
      limitAmount: parseFloat(formData.limitAmount),
      month: `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2, "0")}-01`,
    };

    try {
      if (budgetToEdit) {
        await updateBudget(budgetToEdit.id, payload);
        toast.success("Budget Updated!");
      } else {
        await addBudget(payload);
        toast.success("Budget Added!");
      }

      refresh(); //  reload budgets
      window.dispatchEvent(new Event("transaction-updated")); // 🔥 real-time sync with dashboard

      onClose();
    } catch (err) {
      console.error("Error saving budget:", err);
      toast.error("Error saving budget!");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={{ marginBottom: "12px" }}>
          {budgetToEdit ? "Edit Budget" : "Add Budget"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          />

          <input
            type="number"
            name="limitAmount"
            placeholder="Limit Amount"
            value={formData.limitAmount}
            onChange={(e) =>
              setFormData({ ...formData, limitAmount: e.target.value })
            }
            required
          />

          <div style={styles.actions}>
            <button type="submit" style={styles.addBtn}>
              {budgetToEdit ? "Update" : "Add"}
            </button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Styles
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    width: "400px",
    background: "#1E293B",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 5px 20px rgba(0,0,0,0.4)",
    color: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  addBtn: {
    background: "#3b82f6",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "600",
  },
  cancelBtn: {
    background: "#ef4444",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "600",
  },
  actions: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
  },
};
