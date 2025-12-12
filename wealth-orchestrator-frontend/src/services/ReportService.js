import api from "./api";

export const fetchReportSummary = async () =>
  (await api.get("/reports/summary")).data;

export const fetchReportTrends = async () =>
  (await api.get("/reports/trends")).data;

export const fetchReportCategories = async () =>
  (await api.get("/reports/categories")).data;
