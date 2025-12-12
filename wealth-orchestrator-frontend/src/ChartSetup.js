// src/ChartSetup.js
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// 🔹 REQUIRED for Bar & Pie charts to render
ChartJS.register(
  ArcElement,       // Pie charts
  BarElement,       // Bar charts
  CategoryScale,    // X axis
  LinearScale,      // Y axis
  Tooltip,
  Legend
);

// 🔹 Optional visual defaults so dark theme works well
ChartJS.defaults.color = "#e5e7eb";
ChartJS.defaults.font.family = "Inter, sans-serif";
