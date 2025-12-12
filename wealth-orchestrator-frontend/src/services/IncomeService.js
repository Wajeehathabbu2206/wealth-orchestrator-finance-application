import axios from "axios";

const API_BASE = "http://localhost:8080/api/income";

// CREATE income
export async function addIncome(incomeData) {
  const res = await axios.post(`${API_BASE}`, incomeData);
  return res.data;
}

// GET all incomes
export async function fetchIncomes() {
  const res = await axios.get(`${API_BASE}`);
  return res.data;
}

// DELETE income
export async function deleteIncome(id) {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
}
