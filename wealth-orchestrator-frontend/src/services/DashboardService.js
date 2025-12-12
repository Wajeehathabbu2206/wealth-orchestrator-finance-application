import api from "./api";

export const fetchDashboardSummary = async () =>
  (await api.get("/dashboard/summary")).data;
