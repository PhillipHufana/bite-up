"use client";

import { useState, useEffect } from "react";
import Input from "./ui/Input.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select.jsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion.jsx";

function InventoryRecords() {
  const [records, setRecords] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("newest");

  const fetchInventoryRecords = async () => {
    try {
      const response = await fetch("/api/inventory/records");
      const data = await response.json();

      if (Array.isArray(data)) {
        setRecords(data);
      } else {
        console.error("Invalid inventory data format", data);
        setRecords([]);
      }
    } catch (error) {
      console.error("Failed to fetch inventory records:", error);
      setRecords([]);
    }
  };

  useEffect(() => {
    fetchInventoryRecords();
  }, []);

  const filteredRecords = Array.isArray(records)
    ? records
        .filter((record) => {
          if (!filterDate) return true;
          const localDate = new Date(record.date).toLocaleDateString("en-CA");
          return localDate === filterDate;
        })
        .sort((a, b) => {
          let valA, valB;

          switch (sortBy) {
            case "name":
              valA = a.id.toLowerCase();
              valB = b.id.toLowerCase();
              break;
            case "date":
              valA = new Date(a.date);
              valB = new Date(b.date);
              break;
            case "cost":
              valA = parseFloat(a.totalCost.replace("P ", ""));
              valB = parseFloat(b.totalCost.replace("P ", ""));
              break;
            default:
              return 0;
          }

          const comparison = valA > valB ? 1 : valA < valB ? -1 : 0;
          return orderBy === "newest" ? -comparison : comparison;
        })
    : [];

  return (
    <div className="space-y-6">
      <h2
        className="text-3xl font-marcellus mb-12 mt-3"
        style={{ color: "#444444" }}
      >
        Procurement Records
      </h2>

      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: "rgba(68,68,68,0.15)" }}
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
              className="bg-[rgba(255,255,255,0.59)] text-gray-800 border-none rounded-lg"
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
              <SelectTrigger className="bg-[rgba(255,255,255,0.59)] text-gray-800 border-none rounded-lg">
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
              <SelectTrigger className="bg-[rgba(255,255,255,0.59)] text-gray-800 border-none rounded-lg">
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

      {/* Inventory Records */}
      <Accordion type="single" collapsible className="space-y-4">
        {filteredRecords.map((record) => (
          <AccordionItem
            key={record.id}
            value={record.id}
            className="bg-[rgba(68,68,68,0.09)] rounded-xl"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-4">
                  <div>
                    <div
                      className="font-poppins font-semibold"
                      style={{ color: "#222222" }}
                    >
                      {record.id}
                    </div>
                    <div className="text-sm font-poppins text-gray-600">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-green-600 font-poppins font-bold text-lg">
                    {record.totalCost}
                  </div>
                  <div
                    className="text-sm font-poppins"
                    style={{ color: "#222222" }}
                  >
                    {record.itemCount} items
                  </div>
                  <div
                    className="font-poppins font-semibold"
                    style={{ color: "#222222" }}
                  >
                    {record.supplier}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: "rgba(68, 68, 68, 0.15)" }}
              >
                <table className="w-full">
                  <thead style={{ backgroundColor: "rgba(68, 68, 68, 0.59)" }}>
                    <tr>
                      <th className="px-4 py-3 text-left font-poppins font-semibold text-white">
                        Ingredients
                      </th>
                      <th className="px-4 py-3 text-left font-poppins font-semibold text-white">
                        Brand
                      </th>
                      <th className="px-4 py-3 text-left font-poppins font-semibold text-white">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left font-poppins font-semibold text-white">
                        Unit
                      </th>
                      <th className="px-4 py-3 text-left font-poppins font-semibold text-white">
                        Price per Unit
                      </th>
                      <th className="px-4 py-3 text-left font-poppins font-semibold text-white">
                        Total Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.items.map((item, index) => (
                      <tr
                        key={index}
                        style={{ backgroundColor: "rgba(68, 68, 68, 0.15)" }}
                        className="border-b border-gray-300 hover:bg-opacity-25 transition-colors duration-200"
                      >
                        <td
                          className="px-4 py-3 font-poppins"
                          style={{ color: "#222222" }}
                        >
                          {item.ingredient}
                        </td>
                        <td
                          className="px-4 py-3 font-poppins"
                          style={{ color: "#222222" }}
                        >
                          {item.brand}
                        </td>
                        <td
                          className="px-4 py-3 font-poppins"
                          style={{ color: "#222222" }}
                        >
                          {item.quantity}
                        </td>
                        <td
                          className="px-4 py-3 font-poppins"
                          style={{ color: "#222222" }}
                        >
                          {item.unit}
                        </td>
                        <td
                          className="px-4 py-3 font-poppins"
                          style={{ color: "#222222" }}
                        >
                          {item.unitPrice}
                        </td>
                        <td
                          className="px-4 py-3 font-poppins"
                          style={{ color: "#222222" }}
                        >
                          {item.totalCost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default InventoryRecords;
