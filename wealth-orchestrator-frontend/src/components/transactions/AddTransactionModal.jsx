// AddTransactionModal.jsx
import { useState } from "react";
import { addTransaction } from "../../services/TransactionService";

export default function AddTransactionModal({ isOpen, onClose, refresh }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "EXPENSE",
    date: "",
    category: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      ...formData,
      amount: Math.abs(Number(formData.amount)), // ensure positive number
      date: formData.date,
    };

    await addTransaction(payload);

    if (typeof refresh === "function") {
      await refresh();
    }

    window.dispatchEvent(new Event("transaction-updated"));

    onClose();

  } catch (err) {
    console.error("Error adding transaction:", err.response?.data || err);
  }
};

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Add Transaction</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="Title"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="amount"
            value={formData.amount}
            placeholder="Amount"
            onChange={handleChange}
            required
          />

          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="category"
            value={formData.category}
            placeholder="Category"
            onChange={handleChange}
            required
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "15px",
            }}
          >
            <button type="submit" style={styles.addBtn}>Add</button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#1E293B", padding: "20px", width: "400px", borderRadius: "10px", color: "white" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  addBtn: { background: "#3b82f6", border: "none", padding: "10px 20px", borderRadius: "8px", color: "white", cursor: "pointer" },
  cancelBtn: { background: "#ef4444", border: "none", padding: "10px 20px", borderRadius: "8px", color: "white", cursor: "pointer" }
};
