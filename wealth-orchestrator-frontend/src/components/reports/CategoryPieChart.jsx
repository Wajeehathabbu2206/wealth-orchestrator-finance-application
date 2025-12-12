import { Pie } from "react-chartjs-2";

export default function CategoryPieChart({ categories }) {
  if (!categories || categories.length === 0) {
    return <p style={{ color: "#9ca3af" }}>No category data available</p>;
  }

  const labels = categories.map(c => c.category);
  const values = categories.map(c => c.total);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#ef4444",
          "#f97316",
          "#a855f7",
          "#eab308",
          "#14b8a6",
        ],
        borderWidth: 1,
        borderColor: "#0f172a"
      }
    ]
  };

 const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#ffffff",
        font: {
          size: 12, // Smaller legend text
        },
        padding: 10,
      },
      align: "center",
      maxWidth: 250, // Force wrapping within chart width
    },
  },
  layout: {
    padding: {
      bottom: 20,
    }
  }
};


  return (
    <div style={{ width: "100%", height: "350px" }}>
      <Pie data={data} options={options} />
    </div>
  );
}
