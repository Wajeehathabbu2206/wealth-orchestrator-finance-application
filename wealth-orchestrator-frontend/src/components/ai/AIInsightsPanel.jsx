// src/components/ai/AIInsightsPanel.jsx
import { useEffect, useState } from "react";
import { fetchAIInsights } from "../../services/AIService";
import { MdWarning } from "react-icons/md";
import { FaBullseye, FaLightbulb, FaChartLine } from "react-icons/fa";

function getAccentColor(category) {
  if (!category) return "#6366f1";

  const c = category.toLowerCase();
  if (c.includes("food") || c.includes("grocery")) return "#f97316";
  if (c.includes("rent") || c.includes("home") || c.includes("housing")) return "#22c55e";
  if (c.includes("travel") || c.includes("transport")) return "#eab308";
  if (c.includes("shopping")) return "#ec4899";
  if (c.includes("bills") || c.includes("utilities")) return "#06b6d4";
  if (c.includes("goal")) return "#a855f7";
  return "#6366f1";
}

function getIcon(type, severity) {
  if (type === "BUDGET") return <MdWarning />;
  if (type === "GOAL") return <FaBullseye />;
  if (type === "SPENDING" && severity === "HIGH") return <MdWarning />;
  if (type === "SPENDING") return <FaChartLine />;
  return <FaLightbulb />;
}

export default function AIInsightsPanel() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAIInsights();
        setInsights(data || []);
      } catch (err) {
        console.error("Error fetching AI insights:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ marginTop: "24px", color: "#9ca3af", fontSize: "14px" }}>
        Generating smart insights...
      </div>
    );
  }

  if (!insights.length) {
    return null; // no insights -> hide section
  }

  return (
    <div style={{ marginTop: "24px" }}>
      <h3
        style={{
          marginBottom: "12px",
          fontSize: "16px",
          fontWeight: "600",
          color: "#e5e7eb",
        }}
      >
        🔍 Smart Insights
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        {insights.map((ins, idx) => {
          const accent = getAccentColor(ins.category);
          return (
            <div
              key={idx}
              style={{
                position: "relative",
                padding: "14px 16px 14px 18px",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.6))",
                border: "1px solid rgba(148,163,184,0.35)",
                boxShadow: "0 18px 45px rgba(15,23,42,0.75)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                overflow: "hidden",
              }}
            >
              {/* Accent bar */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "4px",
                  background: accent,
                }}
              />

              {/* Icon bubble */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "999px",
                  background: "rgba(15,23,42,0.9)",
                  border: `1px solid ${accent}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: accent,
                  fontSize: "18px",
                }}
              >
                {getIcon(ins.type, ins.severity)}
              </div>

              {/* Text */}
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#f9fafb",
                    marginBottom: "4px",
                  }}
                >
                  {ins.title}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#cbd5f5",
                    lineHeight: 1.5,
                  }}
                >
                  {ins.message}
                </div>

                {ins.category && (
                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#9ca3af",
                    }}
                  >
                    {ins.category}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
