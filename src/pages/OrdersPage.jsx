"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select.jsx";
import AddOrderModal from "../components/AddOrderModal.jsx";

export default function OrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("newest");

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
          total: `P ${parseFloat(order.total || 0).toFixed(2)}`,
          status: order.status || "Completed",
        };
      });

      setOrders(formatted);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
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

    filtered.sort((a, b) => {
      let comp = 0;
      if (sortBy === "name") {
        comp = a.lastName.localeCompare(b.lastName);
      } else if (sortBy === "date") {
        comp = a.rawDate - b.rawDate;
      } else if (sortBy === "cost") {
        comp =
          parseFloat(a.total.replace("P ", "")) -
          parseFloat(b.total.replace("P ", ""));
      }
      return orderBy === "newest" ? -comp : comp;
    });

    setFilteredOrders(filtered);
  }, [orders, filterDate, sortBy, orderBy]);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-marcellus" style={{ color: "#444444" }}>
        Orders
      </h1>

      <div>
        <div className="flex justify-end mb-8">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="text-white px-6 py-2 rounded-full font-poppins"
            style={{ backgroundColor: "#C1801C" }}
          >
            ADD ORDER +
          </Button>
        </div>

        <div
          className="border-2 rounded-xl p-6 mb-6"
          style={{ borderColor: "#3F331F" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-sm font-poppins mb-2 font-semibold"
                style={{ color: "#222222" }}
              >
                Filter by Date
              </label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-[rgba(68,68,68,0.15)] text-[#444444] border-none rounded-lg"
              />
            </div>
            <div>
              <label
                className="block text-sm font-poppins mb-2 font-semibold"
                style={{ color: "#222222" }}
              >
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-[rgba(68,68,68,0.15)] text-[#444444] border-none rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="cost">Cost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                className="block text-sm font-poppins mb-2 font-semibold"
                style={{ color: "#222222" }}
              >
                Order
              </label>
              <Select value={orderBy} onValueChange={setOrderBy}>
                <SelectTrigger className="bg-[rgba(68,68,68,0.15)] text-[#444444] border-none rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden">
          <table className="w-full">
            <thead style={{ backgroundColor: "rgba(68, 68, 68, 0.59)" }}>
              <tr>
                <th className="px-6 py-4 text-left font-poppins font-semibold text-white">
                  Order Number
                </th>
                <th className="px-6 py-4 text-left font-poppins font-semibold text-white">
                  First Name
                </th>
                <th className="px-6 py-4 text-left font-poppins font-semibold text-white">
                  Last Name
                </th>
                <th className="px-6 py-4 text-left font-poppins font-semibold text-white">
                  Order
                </th>
                <th className="px-6 py-4 text-left font-poppins font-semibold text-white">
                  Total
                </th>
                <th className="px-6 py-4 text-left font-poppins font-semibold text-white">
                  Order Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  style={{ backgroundColor: "rgba(68, 68, 68, 0.15)" }}
                  className="border-b border-gray-300 hover:bg-opacity-25"
                >
                  <td
                    className="px-6 py-4 font-poppins"
                    style={{ color: "#222222" }}
                  >
                    {order.id}
                  </td>
                  <td
                    className="px-6 py-4 font-poppins"
                    style={{ color: "#222222" }}
                  >
                    {order.firstName}
                  </td>
                  <td
                    className="px-6 py-4 font-poppins"
                    style={{ color: "#222222" }}
                  >
                    {order.lastName}
                  </td>
                  <td
                    className="px-6 py-4 font-poppins"
                    style={{ color: "#222222" }}
                  >
                    {order.order}
                  </td>
                  <td className="px-6 py-4 font-poppins text-green-600 font-semibold">
                    {order.total}
                  </td>
                  <td
                    className="px-6 py-4 font-poppins"
                    style={{ color: "#222222" }}
                  >
                    {order.orderDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddOrder={fetchOrders}
        customers={customers}
      />
    </div>
  );
}
