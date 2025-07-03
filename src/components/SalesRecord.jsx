"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function SalesRecord() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [weeklySales, setWeeklySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState(0);
  const [yearlySales, setYearlySales] = useState(0);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

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
    fetchSalesData();
  }, [selectedMonth, selectedYear]);

  const fetchSalesData = async () => {
    try {
      const weeks = getWeeksInMonth(selectedYear, selectedMonth);
      const weekRequests = weeks.map((_, i) =>
        axios.get("/api/sales/weekly", {
          params: { year: selectedYear, month: selectedMonth, week: i + 1 },
        })
      );

      const [monthlyRes, yearlyRes, topItemsRes, ...weeklyRes] =
        await Promise.all([
          axios.get("/api/sales/monthly", {
            params: { year: selectedYear, month: selectedMonth },
          }),
          axios.get("/api/sales/yearly", {
            params: { year: selectedYear },
          }),
          axios.get("/api/sales/top-items"),
          ...weekRequests,
        ]);

      const filteredWeekly = weeklyRes
        .map((res, i) => ({
          week: `Week ${i + 1}`,
          sales: res.data[0]?.total_sales || 0,
        }))
        .filter((w) => w.sales > 0);

      const month =
        monthlyRes.data.find((r) => r.month === selectedMonth)?.total_sales ||
        0;
      const year =
        yearlyRes.data.find((r) => r.year === selectedYear)?.total_sales || 0;

      setWeeklySales(filteredWeekly);
      setMonthlySales(month);
      setYearlySales(year);

      setTopSellingItems(
        topItemsRes.data.map((item, i) => ({
          rank: i + 1,
          name: item.product_name,
          sold: item.total_sold,
          revenue: `P ${item.revenue.toFixed(2)}`,
        }))
      );
    } catch (err) {
      console.error("Error fetching sales data", err);
    }
  };

  const getWeeksInMonth = (year, month) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const weeks = [];
    const firstWeekEnd = new Date(start);
    const dow = start.getDay();
    const daysToSat = (6 - dow + 7) % 7;
    firstWeekEnd.setDate(start.getDate() + daysToSat);
    if (firstWeekEnd > end) firstWeekEnd.setTime(end.getTime());
    weeks.push({ start, end: firstWeekEnd });

    let current = new Date(firstWeekEnd);
    current.setDate(current.getDate() + 1);
    while (current <= end) {
      const weekStart = new Date(current);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      if (weekEnd > end) weekEnd.setTime(end.getTime());
      weeks.push({ start: weekStart, end: weekEnd });
      current.setDate(current.getDate() + 7);
    }
    return weeks;
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const chartData = {
    labels: weeklySales.map((w) => w.week),
    datasets: [
      {
        label: "Weekly Sales",
        data: weeklySales.map((w) => w.sales),
        backgroundColor: "#ffd230",
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: `Weekly Sales`,
        font: { family: "Poppins", size: 16, weight: "bold" },
        color: "#702D05",
      },
    },
    scales: {
      x: { ticks: { color: "#000" }, grid: { color: "#f5d6a3" } },
      y: { ticks: { color: "#000" }, grid: { color: "#f5d6a3" } },
    },
  };

  const doughnutData = {
    labels: ["Monthly Sales", "Yearly Sales"],
    datasets: [
      {
        data: [monthlySales, yearlySales],
        backgroundColor: ["#d08700", "#973c00"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: `Month of ${monthNames[selectedMonth - 1]} ${selectedYear}`,
        font: { family: "Poppins", size: 16, weight: "bold" },
        color: "#702D05",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const val = context.raw || 0;
            return `${context.label}: P ${val.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-marcellus mb-6 mt-3 text-[#702d05]">
        Sales Record
      </h2>

      {/* Filters */}
      <div className="flex gap-6 items-end flex-wrap" ref={dropdownRef}>
        {/* Month Dropdown */}
        <div className="relative">
          <label className="block mb-2 font-semibold text-amber-900">
            Month:
          </label>
          <button
            onClick={() => toggleDropdown("month")}
            className="w-60 bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 shadow-sm flex justify-between items-center"
          >
            {monthNames[selectedMonth - 1]}
            {openDropdown === "month" ? (
              <ChevronUpIcon className="w-5 h-5 text-amber-700" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-amber-700" />
            )}
          </button>
          {openDropdown === "month" && (
            <div className="absolute mt-2 w-60 bg-white rounded-lg shadow-lg ring-1 ring-black/10 z-10">
              {monthNames.map((name, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedMonth(index + 1);
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-amber-100 rounded-lg"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Year Dropdown */}
        <div className="relative">
          <label className="block mb-2 font-semibold text-amber-900">
            Year:
          </label>
          <button
            onClick={() => toggleDropdown("year")}
            className="w-40 bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 shadow-sm flex justify-between items-center"
          >
            {selectedYear}
            {openDropdown === "year" ? (
              <ChevronUpIcon className="w-5 h-5 text-amber-700" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-amber-700" />
            )}
          </button>
          {openDropdown === "year" && (
            <div className="absolute mt-2 w-40 bg-white rounded-lg shadow-lg ring-1 ring-black/10 z-10">
              {[...Array(5)].map((_, i) => {
                const y = new Date().getFullYear() - i;
                return (
                  <button
                    key={y}
                    onClick={() => {
                      setSelectedYear(y);
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-amber-100 rounded-lg"
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl border border-amber-200 p-6 shadow-lg w-full lg:w-2/3 h-[400px]">
          {weeklySales.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 font-poppins text-center">
              No sales available for {monthNames[selectedMonth - 1]}{" "}
              {selectedYear}.
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-amber-200 shadow-lg p-6 w-full lg:w-1/3 h-[400px] flex justify-center items-center">
          <div className="w-full h-full relative flex items-center justify-center">
            {monthlySales === 0 && yearlySales === 0 ? (
              <div className="text-gray-500 font-poppins text-center">
                No sales available for {monthNames[selectedMonth - 1]}{" "}
                {selectedYear}.
              </div>
            ) : (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="rounded-xl overflow-hidden mx-auto max-w-6xl w-full bg-[#fef3c6] shadow-lg">
        <div className="px-6 py-4 bg-gradient-to-br from-amber-200 to-orange-200">
          <h3 className="font-poppins font-semibold text-amber-900 text-lg">
            Top Selling Items
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {topSellingItems.map((item) => (
            <div
              key={item.rank}
              className="rounded-lg px-4 py-3 hover:bg-opacity-20 transition-all duration-200"
              style={{ backgroundColor: "#fef3c6" }}
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
