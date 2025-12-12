import api from "./api";

export const fetchAllTransactions = async () =>
  (await api.get("/transactions")).data;

export const addTransaction = async (data) =>
  (await api.post("/transactions", data)).data;

export const updateTransaction = async (id, data) =>
  (await api.put(`/transactions/${id}`, data)).data;

export const deleteTransaction = async (id) =>
  (await api.delete(`/transactions/${id}`)).data;
