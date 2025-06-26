"use client";

import { useEffect, useRef } from "react";

export default function SalesRecord() {
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    // Load Chart.js
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = () => {
      initializeCharts();
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeCharts = () => {
    if (!window.Chart) return;

    // Line Chart with custom color scheme
    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext("2d");
      new window.Chart(ctx, {
        type: "line",
        data: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
          datasets: [
            {
              label: "Profit",
              data: [200, 300, 1100, 800, 300],
              borderColor: "#E6CA3E",
              backgroundColor: "rgba(230, 202, 62, 0.3)",
              fill: true,
              tension: 0.4,
              borderWidth: 3,
            },
            {
              label: "Revenue",
              data: [250, 250, 250, 250, 350],
              borderColor: "#3F331F",
              backgroundColor: "rgba(63, 51, 31, 0.1)",
              fill: false,
              tension: 0.4,
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                font: {
                  family: "Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
                  size: 14,
                  weight: "bold",
                },
                color: "#222222",
              },
            },
            title: {
              display: true,
              text: "Weekly Sales Performance and Trends",
              font: {
                family: "Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
                size: 16,
                weight: "bold",
              },
              color: "#222222",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 1200,
              grid: {
                color: "rgba(63, 51, 31, 0.2)",
              },
              ticks: {
                color: "#222222",
                font: {
                  family: "Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
                },
              },
            },
            x: {
              grid: {
                color: "rgba(63, 51, 31, 0.2)",
              },
              ticks: {
                color: "#222222",
                font: {
                  family: "Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
                },
              },
            },
          },
        },
      });
    }

    // Pie Chart with custom color scheme
    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext("2d");
      new window.Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Jar", "Bread", "Loaf"],
          datasets: [
            {
              data: [40, 25, 35],
              backgroundColor: ["#E6CA3E", "#3F331F", "#8B7355"],
              borderWidth: 3,
              borderColor: "#fff",
              hoverBorderWidth: 4,
              hoverBorderColor: "#222222",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  family: "Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
                  size: 12,
                  weight: "bold",
                },
                color: "#222222",
              },
            },
            title: {
              display: true,
              text: "Sales by Category",
              font: {
                family: "Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
                size: 16,
                weight: "bold",
              },
              color: "#222222",
            },
          },
        },
      });
    }
  };

  const salesData = [
    { label: "Today's Sales", value: "P 600.00", color: "text-green-600" },
    { label: "Weekly Sales", value: "P 3,000.00", color: "text-blue-600" },
    { label: "Monthly Sales", value: "P 12,000.00", color: "text-purple-600" },
    { label: "Yearly Sales", value: "P 410.20", color: "text-orange-600" },
  ];

  const topSellingItems = [
    { rank: 1, name: "Chocolate Chip Cookies", sold: 3, revenue: "P 200.00" },
    { rank: 2, name: "Ensaymada", sold: 5, revenue: "P 530.00" },
    { rank: 3, name: "Cinnamon Roll", sold: 7, revenue: "P 800.00" },
  ];

  return (
    <div className="space-y-6">
      {/* Heading */}
      <h2
        className="text-3xl font-marcellus  mb-12 mt-3"
        style={{ color: "#444444" }}
      >
        Sales Record
      </h2>
      {/* Sales Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {salesData.map((item, index) => (
          <div
            key={index}
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "rgba(141, 120, 103, 0.25)" }}
          >
            <div className={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </div>
            <div
              className="font-poppins font-semibold"
              style={{ color: "#222222" }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Sales Trends Chart */}
      <div className="rounded-xl p-6">
        <div className="relative h-80">
          <canvas ref={lineChartRef} />
        </div>
      </div>

      {/* Sales by Category and Top Selling Items */}
      <div className="grid grid-cols-2 gap-6">
        {/* Sales by Category Chart s*/}
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: "rgba(63, 51, 31, 0.1)" }}
        >
          <div className="relative h-80">
            <canvas ref={pieChartRef} />
          </div>
        </div>

        {/* Top Selling Items */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "rgba(68, 68, 68, 0.15)" }}
        >
          <div
            className="px-6 py-4"
            style={{ backgroundColor: "rgba(68, 68, 68, 0.59)" }}
          >
            <h3 className="font-poppins font-semibold text-white text-lg">
              Top Selling Items
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {topSellingItems.map((item) => (
              <div
                key={item.rank}
                className="rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200"
                style={{ backgroundColor: "rgba(63, 51, 31, 0.1)" }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div
                      className="text-2xl font-bold"
                      style={{ color: "#444444" }}
                    >
                      #{item.rank}
                    </div>
                    <div>
                      <div className="font-poppins font-semibold text-[#000000] text-lg">
                        {item.name}
                      </div>
                      <div className="text-sm font-poppins text-[#444444]">
                        {item.sold} items sold
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-700">
                      {item.revenue}
                    </div>
                    <div className="text-sm font-poppins text-[#444444]">
                      Revenue
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
