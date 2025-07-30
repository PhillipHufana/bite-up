"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import Navbar from "../components/navbar";
import AddOrderModal from "../components/AddOrderModal";

const Orders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [orderBy, setOrderBy] = useState("Newest First");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  const dropdownRef = useRef(null);

  const orderOptions = ["Newest First", "Oldest First"];

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
          total: parseFloat(order.total || 0).toFixed(2),
        };
      });
      setOrders(formatted);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/customer");
      const data = res.data.map((cust) => ({
        id: cust.customer_id,
        name: `${cust.last_name}, ${cust.first_name}`,
        phone: cust.contact_number,
        email: cust.email,
        address: cust.address,
      }));
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  useEffect(() => {
    let filtered = [...orders];
    if (filterDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(
          order.orderDate.split("/").reverse().join("-")
        );
        const filterDateObj = new Date(filterDate);
        return orderDate.toDateString() === filterDateObj.toDateString();
      });
    }

    // Sorting only by date (Newest/Oldest)
    filtered.sort((a, b) => {
      return orderBy === "Newest First"
        ? b.rawDate - a.rawDate
        : a.rawDate - b.rawDate;
    });

    setFilteredOrders(filtered);
  }, [orders, filterDate, orderBy]);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  // Outside click detection
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar activeTab="ORDERS" />

      <main className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h2 className="font-[Marcellus] text-8xl sm:text-4xl font-bold text-amber-800">
            Orders
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center cursor-pointer space-x-2"
          >
            <span>ADD ORDER</span>
            <span className="text-lg">+</span>
          </button>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          ref={dropdownRef}
        >
          {/* Filter by Date */}
          <div>
            <label className="block mb-1 font-semibold text-amber-900">
              Filter by Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 transition-all duration-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm"
            />
          </div>

          {/* Order Dropdown */}
          <div className="relative">
            <label className="block mb-1 font-semibold text-amber-900">
              Order
            </label>
            <button
              onClick={() => toggleDropdown("order")}
              className="w-full bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 shadow-sm flex justify-between items-center"
            >
              {orderBy}
              {openDropdown === "order" ? (
                <ChevronUpIcon className="w-5 h-5 text-amber-700" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-amber-700" />
              )}
            </button>
            {openDropdown === "order" && (
              <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg ring-1 ring-black/10 z-10">
                {orderOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setOrderBy(option);
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-amber-100 rounded-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
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
                      ₱{order.total}
                    </td>
                    <td className="px-6 py-4">{order.orderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AddOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddOrder={fetchOrders}
          customers={customers}
        />
      </main>
    </div>
  );
};

export default Orders;
