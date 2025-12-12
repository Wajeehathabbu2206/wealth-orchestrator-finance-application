import { Bar } from "react-chartjs-2";

export default function TopCategoriesChart({ categories }) {
  if (!categories || categories.length === 0) {
    return <p style={{ color: "#9ca3af" }}>No category data available</p>;
  }

  const labels = categories.map(c => c.category);
  const values = categories.map(c => c.total);

  const data = {
    labels,
    datasets: [
      {
        label: "Total Spent (₹)",
        data: values,
        backgroundColor: "#ef4444",
        borderRadius: 6,
        barThickness: 45
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 🔥 important for height visibility
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.raw.toLocaleString("en-IN")}`
        }
      }
    },
    scales: {
      y: { ticks: { color: "#ffffff" } },
      x: { ticks: { color: "#ffffff" } }
    }
  };

  return (
    <div style={{ width: "100%", height: "350px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
