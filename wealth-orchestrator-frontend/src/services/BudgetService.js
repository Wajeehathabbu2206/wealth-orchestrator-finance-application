import api from "./api";

export const fetchBudgets = async () => {
  const res = await api.get("/budgets");
  return Array.isArray(res.data) ? res.data : [];
};

export const addBudget = async (budget) => {
  const res = await api.post("/budgets", budget);
  return res.data;
};

export const updateBudget = async (id, budget) => {
  const res = await api.put(`/budgets/${id}`, budget);
  return res.data;
};

export const deleteBudget = async (id) => {
  const res = await api.delete(`/budgets/${id}`);
  return res.data;
};
