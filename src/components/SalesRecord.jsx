"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

function SalesRecord() {
  const lineChartRef = useRef(null);
  const [salesData, setSalesData] = useState([]);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [chartData, setChartData] = useState({
    profit: [],
    revenue: [],
    labels: [],
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekOfMonth());

  function getCurrentWeekOfMonth(date = new Date()) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = start.getDay() || 7;
    const adjustedDate = date.getDate() + dayOfWeek - 1;
    return Math.ceil(adjustedDate / 7);
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = async () => {
      await fetchData();
      initializeCharts();
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [selectedMonth, selectedYear, selectedWeek]);

  const fetchData = async () => {
    try {
      const [weeklyRes, monthlyRes, yearlyRes, profitRes, topItemsRes] =
        await Promise.all([
          axios.get("/api/sales/weekly"),
          axios.get("/api/sales/monthly"),
          axios.get("/api/sales/yearly"),
          axios.get("/api/sales/profit"),
          axios.get("/api/sales/top-items"),
        ]);

      const getCurrentWeek = () => new Date().getWeekNumber();

      const weeklySales =
        weeklyRes.data.find((row) => row.week === getCurrentWeek())
          ?.total_sales || 0;
      const monthlySales =
        monthlyRes.data.find((row) => row.month === selectedMonth)
          ?.total_sales || 0;
      const yearlySales =
        yearlyRes.data.find((row) => row.year === selectedYear)?.total_sales ||
        0;

      setSalesData([
        {
          label: `Week ${selectedWeek} Sales`,
          value: `P ${weeklySales.toFixed(2)}`,
          color: "text-blue-600",
        },

        {
          label: `${monthNames[selectedMonth - 1]} Monthly Sales`,
          value: `P ${monthlySales.toFixed(2)}`,
          color: "text-purple-600",
        },
        {
          label: `${selectedYear} Yearly Sales`,
          value: `P ${yearlySales.toFixed(2)}`,
          color: "text-orange-600",
        },
      ]);

      setChartData({
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        revenue: Array(4).fill(profitRes.data.total_revenue / 4),
        profit: Array(4).fill(profitRes.data.total_profit / 4),
      });

      setTopSellingItems(
        topItemsRes.data.map((item, index) => ({
          rank: index + 1,
          name: item.product_name,
          sold: item.total_sold,
          revenue: `P ${item.revenue.toFixed(2)}`,
        }))
      );
    } catch (err) {
      console.error("Error fetching sales record data:", err);
    }
  };

  Date.prototype.getWeekNumber = function () {
    const d = new Date(
      Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  const initializeCharts = () => {
    if (!window.Chart || !lineChartRef.current) return;

    const ctx = lineChartRef.current.getContext("2d");

    if (window.salesChart) {
      window.salesChart.destroy();
    }

    window.salesChart = new window.Chart(ctx, {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Profit",
            data: chartData.profit,
            borderColor: "#E6CA3E",
            backgroundColor: "rgba(230, 202, 62, 0.3)",
            fill: true,
            tension: 0.4,
            borderWidth: 3,
          },
          {
            label: "Revenue",
            data: chartData.revenue,
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
              font: { family: "Poppins, sans-serif", size: 14, weight: "bold" },
              color: "#222222",
            },
          },
          title: {
            display: true,
            text: "Monthly Sales Performance and Trends",
            font: { family: "Poppins, sans-serif", size: 16, weight: "bold" },
            color: "#222222",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(63, 51, 31, 0.2)" },
            ticks: {
              color: "#222222",
              font: { family: "Poppins, sans-serif" },
            },
          },
          x: {
            grid: { color: "rgba(63, 51, 31, 0.2)" },
            ticks: {
              color: "#222222",
              font: { family: "Poppins, sans-serif" },
            },
          },
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <h2
        className="text-3xl font-marcellus mb-4 mt-3"
        style={{ color: "#444444" }}
      >
        Sales Record
      </h2>

      <div className="flex gap-4 items-center flex-wrap">
        <label className="text-sm text-[#444]">Select Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {monthNames.map((name, index) => (
            <option key={index} value={index + 1}>
              {name}
            </option>
          ))}
        </select>

        <label className="text-sm text-[#444]">Select Week:</label>
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[1, 2, 3, 4].map((week) => (
            <option key={week} value={week}>
              Week {week}
            </option>
          ))}
        </select>

        <label className="text-sm text-[#444]">Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[...Array(5)].map((_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {salesData.map((item, index) => (
          <div
            key={index}
            className="rounded-xl p-3 text-center"
            style={{ backgroundColor: "rgba(141, 120, 103, 0.25)" }}
          >
            <div className={`text-3xl font-bold ${item.color}`}>
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

      <div className="rounded-xl p-6">
        <div className="relative h-80">
          <canvas ref={lineChartRef} />
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden mx-auto max-w-[60rem] w-full"
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
              className="rounded-lg px-4 py-3 hover:bg-opacity-20 transition-all duration-200"
              style={{ backgroundColor: "rgba(63, 51, 31, 0.1)" }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-[#444444]">
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
                  <div className="text-lg font-bold text-green-700">
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
  );
}

export default SalesRecord;
