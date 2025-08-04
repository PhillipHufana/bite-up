"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

function SalesRecord() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const [topSellingItems, setTopSellingItems] = useState([]);

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

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders");
      const formatted = res.data.map((order) => {
        const dateObj = new Date(order.delivery_date);
        return {
          id: order.id,
          customerId: order.customer_id,
          firstName: order.first_name,
          lastName: order.last_name,
          order: order.order_name,
          rawDate: dateObj,
          orderDate: isNaN(dateObj)
            ? "Invalid date"
            : dateObj.toLocaleDateString("en-GB"),
          month: dateObj.getMonth() + 1,
          year: dateObj.getFullYear(),
          total: parseFloat(order.total || 0),
        };
      });
      setOrders(formatted);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setLoading(false);
    }
  };

  // Fetch top selling items
  const fetchTopSellingItems = async () => {
    try {
      const res = await axios.get("/api/sales/top-items");
      setTopSellingItems(
        res.data.map((item, i) => ({
          rank: i + 1,
          name: item.product_name,
          sold: item.total_sold,
          revenue: `P ${item.revenue.toFixed(2)}`,
        }))
      );
    } catch (err) {
      console.error("Error fetching top selling items", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchTopSellingItems();
  }, []);

  // Filter orders by selected month/year
  useEffect(() => {
    const filtered = orders.filter(
      (o) => o.month === selectedMonth && o.year === selectedYear
    );
    setFilteredOrders(filtered);

    const total = filtered.reduce((sum, o) => sum + o.total, 0);
    setTotalSales(total);
  }, [orders, selectedMonth, selectedYear]);

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

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-marcellus mb-6 mt-3 text-[#702d05]">
        Sales Record
      </h2>

      {/* Month / Year Filters */}
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

        {/* Total Sales */}
        <div className="flex items-center gap-2 mt-6">
          <span className="text-lg font-semibold text-amber-900">
            Total Sales:
          </span>
          <span className="text-xl font-bold text-green-700">
            ₱{totalSales.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="text-amber-700 ml-4 text-lg">Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-amber-200 text-amber-900 font-semibold">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">First Name</th>
                <th className="px-6 py-4">Last Name</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="odd:bg-white even:bg-amber-50 hover:bg-amber-100 transition"
                >
                  <td className="px-6 py-4">{order.id}</td>
                  <td className="px-6 py-4">{order.firstName}</td>
                  <td className="px-6 py-4">{order.lastName}</td>
                  <td className="px-6 py-4">{order.order}</td>
                  <td className="px-6 py-4 text-green-600 font-semibold">
                    ₱{order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">{order.orderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
