// src/pages/TransactionsPage.jsx
import { useEffect, useState } from "react";
import {
  fetchAllTransactions,
  deleteTransaction,
} from "../services/TransactionService";
import EditTransactionModal from "../components/transactions/EditTransactionModal";
import AddTransactionModal from "../components/transactions/AddTransactionModal";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);
  const [isEditOpen, setEditOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

const loadTransactions = async () => {
  try {
    setLoading(true);
    const data = await fetchAllTransactions();
    const list = Array.isArray(data) ? data : [];

    const sorted = list
      .filter(t => t.date) 
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setTransactions(sorted);
    setCurrentPage(1);
  } catch (err) {
    console.error("Error loading transactions:", err);
    setTransactions([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      await loadTransactions();
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  const totalPages =
    transactions.length === 0
      ? 1
      : Math.ceil(transactions.length / rowsPerPage);

  const visibleRows = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="main-content page-content">
      <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#f9fafb" }}>
        Transactions
      </h2>

       <p style={{ color: "#f9fafbd9", fontSize: "16px" }}>
          Track and manage all your incomes and expenses in one place.
        </p>

      {/* Add Transaction Button (always visible) */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "16px",
          marginTop: "10px",
        }}
      >
        <button
          onClick={() => setShowAddModal(true)}
          style={btnStyle("#3b82f6")}
        >
          + Add Transaction
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#fff" }}>Loading...</p>
      ) : (
        <>
          <div
            style={{
              background: "#0f172a",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1f2937" }}>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ padding: "20px", textAlign: "center" }}
                    >
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((tx) => (
                    <tr key={tx.id}>
                      <td style={tdStyle}>{tx.title}</td>
                      <td style={tdStyle}>
                        <span style={badge("#1e3a8a", "#dbeafe")}>
                          {tx.category}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={
                            tx.type === "INCOME"
                              ? badge("#14532d", "#bbf7d0")
                              : badge("#7f1d1d", "#fecaca")
                          }
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {tx.date ? new Date(tx.date).toDateString() : "-"}
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              tx.type === "EXPENSE" ? "#ef4444" : "#10b981",
                          }}
                        >
                          {tx.type === "EXPENSE" ? "-" : "+"}₹
                          {Math.abs(tx.amount)}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          style={btn("#22c55e")}
                          onClick={() => {
                            setSelectedTx(tx);
                            setEditOpen(true);
                          }}
                        >
                          ✏
                        </button>
                        <button
                          style={btn("#ef4444")}
                          onClick={() => handleDelete(tx.id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {transactions.length > 0 && (
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={pageBtn}
              >
                ‹ Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                style={pageBtn}
              >
                Next ›
              </button>
            </div>
          )}

          {/* Edit Modal */}
          <EditTransactionModal
            isOpen={isEditOpen}
            onClose={() => setEditOpen(false)}
            transaction={selectedTx}
            refresh={loadTransactions}
          />

          {/* Add Modal */}
          {showAddModal && (
            <AddTransactionModal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              refresh={loadTransactions}
            />
          )}
        </>
      )}
    </div>
  );
}

const thStyle = {
  padding: "10px",
  textAlign: "left",
  color: "#9ca3af",
};
const tdStyle = {
  padding: "12px 10px",
  color: "#ffffff",
  borderBottom: "1px solid #1f2937",
};

const badge = (bg, color) => ({
  padding: "4px 10px",
  borderRadius: "12px",
  background: bg,
  color,
  fontSize: "12px",
});

const btn = (bg) => ({
  background: bg,
  border: "none",
  padding: "6px 10px",
  color: "white",
  borderRadius: "6px",
  marginRight: "4px",
  cursor: "pointer",
});

const pageBtn = {
  background: "#1e293b",
  border: "none",
  color: "white",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const btnStyle = (bg) => ({
  background: bg,
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
});
