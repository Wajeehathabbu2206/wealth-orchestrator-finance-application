import axios from "axios";

const API_BASE = "http://localhost:8080/api/expense";

// CREATE expense
export async function addExpense(expenseData) {
  const res = await axios.post(`${API_BASE}`, expenseData);
  return res.data;
}

// GET all expenses
export async function fetchExpenses() {
  const res = await axios.get(`${API_BASE}`);
  return res.data;
}

// DELETE expense
export async function deleteExpense(id) {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
}
