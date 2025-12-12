import api from "./api";

export const fetchAllGoals = async () =>
  (await api.get("/goals")).data;

export const createGoal = async (goal) =>
  (await api.post("/goals", goal)).data;

export const updateGoal = async (id, goal) =>
  (await api.put(`/goals/${id}`, goal)).data;

export const deleteGoal = async (id) =>
  (await api.delete(`/goals/${id}`)).data;
