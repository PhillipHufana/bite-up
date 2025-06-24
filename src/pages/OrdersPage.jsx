"use client";

import { useState, useEffect } from "react";
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

const mockOrders = [
  {
    id: "TRC-2025-001",
    firstName: "Gracie",
    lastName: "Abot",
    order: "2x Chocolate Cake, 1x Vanilla Cupcake",
    deliveryDate: "01-18-2025",
    customerId: "1",
    total: "P 350.00",
    status: "Completed",
  },
  {
    id: "TRC-2025-002",
    firstName: "Melvine",
    lastName: "Pasaporte",
    order: "3x Ensaymada, 2x Cinnamon Roll",
    deliveryDate: "01-18-2025",
    customerId: "2",
    total: "P 250.00",
    status: "Completed",
  },
];

export default function OrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState(mockOrders);
  const [customers, setCustomers] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("newest");

  // Load customers from localStorage or use mock data
  useEffect(() => {
    const savedCustomers = localStorage.getItem("biteup-customers");
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      // Mock customers data
      const mockCustomers = [
        {
          id: "1",
          name: "Abot, Gracie",
          phone: "0912 345 6789",
          email: "grabot@gmail.com",
          address: "Sitio Basak, Mintal, Davao City",
          customerSince: "November 11, 2024",
          totalOrders: 1,
          totalSpent: "P 350.00",
          orderHistory: [],
        },
        {
          id: "2",
          name: "Pasaporte, Melvine",
          phone: "0912 345 6789",
          email: "ms@gmail.com",
          address: "TTBDO, Davao City",
          customerSince: "January 23, 2025",
          totalOrders: 1,
          totalSpent: "P 3,250.00",
          orderHistory: [],
        },
      ];
      setCustomers(mockCustomers);
      localStorage.setItem("biteup-customers", JSON.stringify(mockCustomers));
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...orders];

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(
          order.deliveryDate.split("-").reverse().join("-")
        );
        const filterDateObj = new Date(filterDate);
        return orderDate.toDateString() === filterDateObj.toDateString();
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.lastName.localeCompare(b.lastName);
          break;
        case "date":
          const dateA = new Date(a.deliveryDate.split("-").reverse().join("-"));
          const dateB = new Date(b.deliveryDate.split("-").reverse().join("-"));
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case "order":
          comparison = a.order.localeCompare(b.order);
          break;
        default:
          comparison = 0;
      }

      return orderBy === "newest" ? -comparison : comparison;
    });

    setFilteredOrders(filtered);
  }, [orders, filterDate, sortBy, orderBy]);

  const handleAddOrder = (newOrder) => {
    // Check if customer exists
    const customer = customers.find(
      (c) =>
        c.name.toLowerCase().includes(newOrder.firstName.toLowerCase()) &&
        c.name.toLowerCase().includes(newOrder.lastName.toLowerCase())
    );

    if (!customer) {
      alert(
        "Customer not found! Please add the customer to the Customer Profile first."
      );
      return;
    }

    // Add order
    const orderWithId = {
      ...newOrder,
      id: `TRC-2025-${String(Date.now()).slice(-3)}`,
      customerId: customer.id,
    };

    const updatedOrders = [...orders, orderWithId];
    setOrders(updatedOrders);

    // Update customer's order history
    const updatedCustomers = customers.map((c) => {
      if (c.id === customer.id) {
        const newOrderHistory = {
          orderCode: orderWithId.id,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          items: newOrder.orderItems
            ? newOrder.orderItems.map(
                (item) => `${item.quantity}x ${item.name}`
              )
            : [newOrder.order],
          itemCosts: newOrder.orderItems
            ? newOrder.orderItems.map(
                (item) => `P ${(item.quantity * item.price).toFixed(2)}`
              )
            : [newOrder.total],
          total: newOrder.total,
          status: "Completed",
        };

        const totalSpentNum = Number.parseFloat(
          c.totalSpent.replace("P ", "").replace(",", "")
        );
        const newOrderTotal = Number.parseFloat(
          newOrder.total.replace("P ", "").replace(",", "")
        );

        return {
          ...c,
          totalOrders: c.totalOrders + 1,
          totalSpent: `P ${(totalSpentNum + newOrderTotal).toFixed(2)}`,
          orderHistory: [...c.orderHistory, newOrderHistory],
        };
      }
      return c;
    });

    setCustomers(updatedCustomers);
    localStorage.setItem("biteup-customers", JSON.stringify(updatedCustomers));
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title - Outside the container */}
      <h1 className="text-4xl font-marcellus" style={{ color: "#444444" }}>
        Orders
      </h1>

      {/* Main Content Container - Increased border radius */}
      <div>
        {/* Add Order Button */}
        <div className="flex justify-end mb-8">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="text-white px-6 py-2 rounded-full font-poppins transition-all duration-300"
            style={{ backgroundColor: "#C1801C" }}
          >
            ADD ORDER +
          </Button>
        </div>

        {/* Filters */}
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

        {/* Orders Table - Updated colors with specified opacity */}
        <div className="rounded-xl overflow-hidden">
          <table className="w-full">
            <thead style={{ backgroundColor: "rgba(68, 68, 68, 0.59)" }}>
              <tr>
                <th className="px-6 py-4 text-left font-poppins font-semibold text-white">
                  Transaction Number
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
                  Delivery Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr
                  key={order.id}
                  style={{ backgroundColor: "rgba(68, 68, 68, 0.15)" }}
                  className="border-b border-gray-300 hover:bg-opacity-25 transition-colors duration-200"
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
                  <td className="px-6 py-4 font-poppins font-semibold text-green-600">
                    {order.total}
                  </td>
                  <td
                    className="px-6 py-4 font-poppins"
                    style={{ color: "#222222" }}
                  >
                    {order.deliveryDate}
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
        onAddOrder={handleAddOrder}
        customers={customers}
      />
    </div>
  );
}
