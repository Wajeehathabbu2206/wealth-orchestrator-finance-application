import api from "./api";

export async function fetchAIInsights() {
  const res = await api.get("/ai/insights");
  return res.data;
}
