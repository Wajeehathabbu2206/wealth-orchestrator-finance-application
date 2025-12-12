import { useState, useEffect } from "react";
import { updateTransaction } from "../../services/TransactionService";

export default function EditTransactionModal({ isOpen, onClose, transaction, refresh }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "EXPENSE",
    date: "",
    category: "",
    notes: "",
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        title: transaction.title || "",
        amount: Math.abs(transaction.amount) || "",
        type: transaction.type,
        date: transaction.date,
        category: transaction.category || "",
        notes: transaction.notes || "",
      });
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: Math.abs(parseFloat(formData.amount)),
      };

      await updateTransaction(transaction.id, payload);
      refresh();
      onClose();
    } catch (err) {
      console.error("Error updating:", err.response?.data || err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Edit Transaction</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="title" required value={formData.title} onChange={handleChange} />
          <input type="number" name="amount" required value={formData.amount} onChange={handleChange} />
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <input type="date" name="date" required value={formData.date} onChange={handleChange} />
          <input name="category" required value={formData.category} onChange={handleChange} />
          <textarea name="notes" value={formData.notes} onChange={handleChange} />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
            <button type="submit" style={styles.saveBtn}>Save</button>
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
